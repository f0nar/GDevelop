// @flow
import { Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import { type I18n as I18nType } from '@lingui/core';
import { t } from '@lingui/macro';

import * as React from 'react';
import uniq from 'lodash/uniq';
import LayerRemoveDialog from '../LayersList/LayerRemoveDialog';
import LayerEditorDialog from '../LayersList/LayerEditorDialog';
import VariablesEditorDialog from '../VariablesList/VariablesEditorDialog';
import ObjectEditorDialog from '../ObjectEditor/ObjectEditorDialog';
import ObjectExporterDialog from '../ObjectEditor/ObjectExporterDialog';
import ObjectGroupEditorDialog from '../ObjectGroupEditor/ObjectGroupEditorDialog';
import InstancesSelection from '../InstancesEditor/InstancesSelection';
import SetupGridDialog from './SetupGridDialog';
import ScenePropertiesDialog from './ScenePropertiesDialog';
import { type ObjectEditorTab } from '../ObjectEditor/ObjectEditorDialog';
import MosaicEditorsDisplayToolbar from './MosaicEditorsDisplay/Toolbar';
import SwipeableDrawerEditorsDisplayToolbar from './SwipeableDrawerEditorsDisplay/Toolbar';
import { serializeToJSObject, unserializeFromJSObject } from '../Utils/Serializer';
import Clipboard, { SafeExtractor } from '../Utils/Clipboard';
import Window from '../Utils/Window';
import { ResponsiveWindowMeasurer } from '../UI/Reponsive/ResponsiveWindowMeasurer';
import DismissableInfoBar from '../UI/Messages/DismissableInfoBar';
import ContextMenu, { type ContextMenuInterface } from '../UI/Menu/ContextMenu';
import { shortenString } from '../Utils/StringHelpers';
import getObjectByName from '../Utils/GetObjectByName';
import UseSceneEditorCommands from './UseSceneEditorCommands';
import { type InstancesEditorSettings } from '../InstancesEditor/InstancesEditorSettings';
import { type ResourceManagementProps } from '../ResourcesList/ResourceSource';
import EditSceneIcon from '../UI/CustomSvgIcons/EditScene';
import {
  type HistoryState,
  undo,
  redo,
  canUndo,
  canRedo,
  getHistoryInitialState,
  saveToHistory,
} from '../Utils/History';
import PixiResourcesLoader from '../ObjectsRendering/PixiResourcesLoader';
import {
  type ObjectWithContext,
  type GroupWithContext,
  enumerateObjects,
} from '../ObjectsList/EnumerateObjects';
import InfoBar from '../UI/Messages/InfoBar';
import { type SelectedTags } from '../Utils/TagsHelper';
import { type UnsavedChanges } from '../MainFrame/UnsavedChangesContext';
import SceneVariablesDialog from './SceneVariablesDialog';
import { onObjectAdded, onInstanceAdded } from '../Hints/ObjectsAdditionalWork';
import { type InfoBarDetails } from '../Hints/ObjectsAdditionalWork';
import { type HotReloadPreviewButtonProps } from '../HotReload/HotReloadPreviewButton';
import EventsRootVariablesFinder from '../Utils/EventsRootVariablesFinder';
import { MOVEMENT_BIG_DELTA } from '../UI/KeyboardShortcuts';
import { getInstancesInLayoutForObject } from '../Utils/Layout';
import { zoomInFactor, zoomOutFactor } from '../Utils/ZoomUtils';
import debounce from 'lodash/debounce';
import { mapFor } from '../Utils/MapFor';
import MosaicEditorsDisplay from './MosaicEditorsDisplay';
import SwipeableDrawerEditorsDisplay from './SwipeableDrawerEditorsDisplay';
import { type SceneEditorsDisplayInterface } from './EditorsDisplay.flow';
import newNameGenerator from '../Utils/NewNameGenerator';

import * as theatreCore from '@theatre/core';
import { ISheet, ISheetObject, IProject } from '@theatre/core';
import studio, { IExtension, ToolsetConfig } from '@theatre/studio';

type TheatreInstanceBinding = {
  sheet: ISheet,
  tween: ISheetObject,
  onValuesChangeBinding: VoidFunction
}

type SelectionDataT = (ISheet | ISheetObject<{}>)[];

export class TheatreHelper {
  static isSheetObject(obj) {
    return !!obj && 'address' in obj && 'objectKey' in obj.address && 'sheet' in obj;
  }

  onSelectionChangeCb: { cb: (_old: SelectionDataT, _new: SelectionDataT) => void, once: boolean } = [];
  currentSelection: SelectionDataT = [];
  instanceBindings = new Map<string, TheatreInstanceBinding[]>();
  project: gdProject;
  instancesSelection: InstancesSelection;
  onValuesChange: VoidFunction;
  initialInstances: gdInitialInstancesContainer;
  projectData: object;
  theatreProject: IProject;
  sheetId = 0;

  constructor(
    project: gdProject,
    instancesSelection: InstancesSelection,
    initialInstances: gdInitialInstancesContainer,
    onValuesChange: VoidFunction = () => { }
  ) {
    this.project = project;
    this.instancesSelection = instancesSelection;
    this.onValuesChange = onValuesChange;
    this.initialInstances = initialInstances;

    const theatreVarName = '__THEATRE_CONFIG__';
    const varContainer = this.project.getVariables();
    const theatreVar = varContainer.get(theatreVarName);
    const projectString = theatreVar.getString();
    this.projectData = JSON.parse(projectString);
  }

  sheetsNumber() {
    return this.sheetId++;
    // return Object.keys(this.projectData.sheetsById || { }).length;
  }

  isSelectionActive() {
    return Array.isArray(this.currentSelection) && !!this.currentSelection.length;
  }

  onInstancesSelected(instances: gdInitialInstance[]) {
    if (instances.length !== 1 || !this.instanceBindings.has(instances[0].getPersistentUUID())) return;

    const [instance] = instances;
    const instanceBindings = this.instanceBindings.get(instance.getPersistentUUID());
    const isSelectionActive = this.isSelectionActive();
    
    if (!isSelectionActive) {
      if (instanceBindings.length === 1) {
        studio.setSelection([instanceBindings[0].tween]);
      }

      return;
    }

    const [selection] = this.currentSelection;
    const sameSheet = TheatreHelper.isSheetObject(selection) ? selection.sheet : selection;
    for (const binding of instanceBindings) {
      if (binding.sheet === sameSheet) {
        studio.setSelection([binding.tween]);
        break;
      }
    }
  }

  onSelectionChange(cb: (_old: SelectionDataT, _new: SelectionDataT) => void, once = false) {
    this.onSelectionChangeCb.push({ cb, once });
  }

  getInstanceUUIDFor(obj: ISheetObject) {
    for (const [key, dataArray] of this.instanceBindings) {
      for (const { tween } of dataArray) {
        if (tween === obj) return key;
      }
    }

    return '';
  }

  
  _onInstancesModified(modifiedInstances: gdInitialInstance[]) {
    this.onInstancesMoved(modifiedInstances);
  }

  __onSelectionChange(currentSelection: SelectionDataT) {
    const oldSelection = this.currentSelection;
    this.currentSelection = currentSelection;

    for (const cbData of this.onSelectionChangeCb) {
      cbData.cb(oldSelection, this.currentSelection);

      if (cbData.once) {
        this.onSelectionChangeCb.splice(this.onSelectionChangeCb.indexOf(cbData), 1)
      }
    }

    const getInstance = (uuid) => {
      let newSelectionInstance;
      const instanceGetter = new gd.InitialInstanceJSFunctor();
      instanceGetter.invoke = instancePtr => {
        const instance: gdInitialInstance = gd.wrapPointer(
          instancePtr,
          gd.InitialInstance
        );
        if (instance.getPersistentUUID() === uuid) {
          newSelectionInstance = instance;
        }
      };
      this.initialInstances.iterateOverInstances(instanceGetter);

      return newSelectionInstance;
    }

    // select sheet/object after sheet/object
    if (oldSelection.length && currentSelection.length) {
      const a = oldSelection[0], b = currentSelection[0];
      const aObject = TheatreHelper.isSheetObject(a), bObject = TheatreHelper.isSheetObject(b);

      // if object selected after object
      if (aObject && bObject) {
        // if objects under same sheet
        if (a.sheet === b.sheet) {
          this.instancesSelection.clearSelection();
          const uuid = this.getInstanceUUIDFor(b);
          const newSelectionInstance = getInstance(uuid);

          if (!newSelectionInstance) {
            console.log('new selection is undefined ', uuid)
          }

          this.instancesSelection.selectInstance({
            instance: newSelectionInstance,
            multiSelect: false,
            layersLocks: null,
          })
        // new selection is from another sheet
        } else {
          // unsubscribe old sheet
          for (const [uuid, bindingsData] of this.instanceBindings) {
            for (const binding of bindingsData) {
              if (binding.sheet === a.sheet && binding.onValuesChangeBinding) {
                binding.onValuesChangeBinding();
                binding.onValuesChangeBinding = undefined;
              }
            }
          }
          // subscribe new shit
          for (const [uuid, bindingsData] of this.instanceBindings) {
            for (const binding of bindingsData) {
              if (binding.sheet === b.sheet) {
                binding.onValuesChangeBinding = binding.tween.onValuesChange((values) => {
                  const { x, y } = values.position;
                  const instance = getInstance(uuid);
  
                  instance.setX(x);
                  instance.setY(y);
  
                  this.onValuesChange();
                });

                if (bObject) {
                  this.instancesSelection.clearSelection();
                  const uuid = this.getInstanceUUIDFor(b);
                  const newSelectionInstance = getInstance(uuid);

                  if (!newSelectionInstance) {
                    console.log('new selection is undefined ', uuid)
                  }
                  this.instancesSelection.selectInstance({
                    instance: newSelectionInstance,
                    multiSelect: false,
                    layersLocks: null,
                  });
                }

                break;
              }
            }
          }
        }
      }
    } else if (oldSelection.length) {
      const old = oldSelection[0];
      const sheet = TheatreHelper.isSheetObject(old) ? old.sheet : old;

      for (const [uuid, bindingsData] of this.instanceBindings) {
        for (const binding of bindingsData) {
          if (binding.sheet === sheet && binding.onValuesChangeBinding) {
            binding.onValuesChangeBinding();
            binding.onValuesChangeBinding = undefined;
          }
        }
      }
    } else if (currentSelection.length) {
      const selection = currentSelection[0];
      const isObjectSelected = TheatreHelper.isSheetObject(selection);
      const sheet = isObjectSelected ? selection.sheet : selection;

      for (const [uuid, bindingsData] of this.instanceBindings) {
        for (const binding of bindingsData) {
          if (binding.sheet === sheet) {
            binding.onValuesChangeBinding = binding.tween.onValuesChange((values) => {
              const { x, y } = values.position;
              const instance = getInstance(uuid);

              instance.setX(x);
              instance.setY(y);

              this.onValuesChange();
            });

            if (isObjectSelected) {
              this.instancesSelection.clearSelection();
              const uuid = this.getInstanceUUIDFor(selection);
              const newSelectionInstance = getInstance(uuid);

              if (!newSelectionInstance) {
                console.log('new selection is undefined ', uuid)
              }
              this.instancesSelection.selectInstance({
                instance: newSelectionInstance,
                multiSelect: false,
                layersLocks: null,
              });
            }

            break;
          }
        }
      }
    }
  }

  onInstancesMoved(instances: gdInitialInstance[]) {
    // you are not in animation mode
    if (!this.isSelectionActive()) return;

    const selection = this.currentSelection[0];
    const sheet = TheatreHelper.isSheetObject(selection) ? selection.sheet : selection; 

    for (const instance of instances) {
      if (!this.instanceBindings.has(instance.getPersistentUUID())) return;

      studio.transaction(({ set }) => {
        for (const instanceBinding of this.instanceBindings.get(instance.getPersistentUUID())) {
          if (instanceBinding.sheet === sheet) {
            set(instanceBinding.tween.props.position, {
              x: instance.getX(),
              y: instance.getY(),
            });
          }
        }
      })
    }
  }

  recover() {
    const getInstance = (uuid) => {
      let newSelectionInstance;
      const instanceGetter = new gd.InitialInstanceJSFunctor();
      instanceGetter.invoke = instancePtr => {
        const instance: gdInitialInstance = gd.wrapPointer(
          instancePtr,
          gd.InitialInstance
        );
        if (instance.getPersistentUUID() === uuid) {
          newSelectionInstance = instance;
        }
      };
      this.initialInstances.iterateOverInstances(instanceGetter);

      return newSelectionInstance;
    };
    const {sheetsById} = this.projectData;

    for (const sheetId in sheetsById) {
      const { byObject: objectsById } = sheetsById[sheetId].staticOverrides;
      const sheet = this.theatreProject.sheet(sheetId);
      
      for (const objectId in objectsById) {
        const object = sheet.object(objectId, objectsById[objectId]);
        const uuid = objectId.split('(')[1].slice(0, -1);
        const instance = getInstance(uuid);

        console.log('instatnce ', uuid, instance)

        const instanceBinding = {
          sheet,
          tween: object,
          // onValuesChangeBinding
        };
        if (this.instanceBindings.has(uuid)) {
          this.instanceBindings.get(uuid).push(instanceBinding);
        } else {
          this.instanceBindings.set(uuid, [instanceBinding]);
        }
      }
    }
  }

  initialize() {
    const helper = this;
    const theatreExtension: IExtension = {
      id: 'gdevelop-extension',
      toolbars: {
        global(set, studio) {
          const conf: ToolsetConfig = [{
            type: 'Icon',
            title: 'Add Sheet',
            svgSource: '➕',
            onClick: () => {
              if (!helper.instancesSelection.hasSelectedInstances()) return;

              // check if saved state if available in variables
              // const theatreProject = theatreCore.getProject(helper.project.getName());
              const sheetName = `Sheet${helper.sheetsNumber()}`;
              const sheet = helper.theatreProject.sheet(sheetName);
              const sheetObjects = { };

              for (const selectedInstance of helper.instancesSelection.getSelectedInstances()) {
                const fullName = `${selectedInstance.getObjectName()} (${selectedInstance.getPersistentUUID()})`;
                const theatreInstance = sheet.object(fullName, {
                  position: theatreCore.types.compound({
                    x: selectedInstance.getX(),
                    y: selectedInstance.getY(),
                  })
                });

                // const onValuesChangeBinding = theatreInstance.onValuesChange((values) => {
                //   const { x, y } = values.position;

                //   selectedInstance.setX(x);
                //   selectedInstance.setY(y);

                //   helper.onValuesChange();
                // });

                sheetObjects[fullName] = {
                  name: selectedInstance.getObjectName(),
                  uuid: selectedInstance.getPersistentUUID()
                };

                const instanceBinding = {
                  sheet,
                  tween: theatreInstance,
                  // onValuesChangeBinding
                };
                if (helper.instanceBindings.has(selectedInstance.getPersistentUUID())) {
                  helper.instanceBindings.get(selectedInstance.getPersistentUUID()).push(instanceBinding);
                } else {
                  helper.instanceBindings.set(selectedInstance.getPersistentUUID(), [instanceBinding]);
                }
              }

              const varContainer = helper.project.getVariables();
              const sheetVar = varContainer.has(sheetName) ?
                varContainer.get(sheetName) :
                varContainer.insertNew(sheetName);
              sheetVar.setString(JSON.stringify(sheetObjects));        
            }
          // }, {
          //   type: 'Icon',
          //   title: 'Remove Sheet',
          //   svgSource: '➖',
          //   onClick: () => {
          //     if (!helper.isSelectionActive()) return;

          //     studio.transaction((api) => {
          //       const [selection] = helper.currentSelection;

          //       if (TheatreHelper.isSheetObject(selection)) {
          //         api.__experimental_forgetSheet(selection.sheet);
          //       } else {
          //         api.__experimental_forgetSheet(selection);
          //       }

          //       studio.initialize()
          //     });
          //   }
          }];

          set(conf);
        },
      },
      panes: [],
    }

    studio.extend(theatreExtension, { __experimental_reconfigure: true });
    
    return (
      studio
        .initialize()
        .then(() => {
          studio.onSelectionChange(helper.__onSelectionChange.bind(helper));
          helper.theatreProject = theatreCore.getProject(helper.project.getName(), { state: helper.projectData });
          // helper.theatreProject = theatreCore.getProject(helper.project.getName());
          console.log(helper.projectData)
          helper.theatreProject.ready.then(() => helper.recover());
        })
    )
  }
}

const gd: libGDevelop = global.gd;

const BASE_LAYER_NAME = '';
const INSTANCES_CLIPBOARD_KIND = 'Instances';

export type EditorId =
  | 'objects-list'
  | 'properties'
  | 'object-groups-list'
  | 'instances-list'
  | 'layers-list';

const styles = {
  container: {
    display: 'flex',
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
};

type Props = {|
  initialInstances: gdInitialInstancesContainer,
  getInitialInstancesEditorSettings: () => InstancesEditorSettings,
  layout: gdLayout,
  onEditObject?: ?(object: gdObject) => void,
  onOpenMoreSettings?: ?() => void,
  onOpenEvents: (sceneName: string) => void,
  project: gdProject,
  setToolbar: (?React.Node) => void,
  resourceManagementProps: ResourceManagementProps,
  isActive: boolean,
  unsavedChanges?: ?UnsavedChanges,
  canInstallPrivateAsset: () => boolean,
  openBehaviorEvents: (extensionName: string, behaviorName: string) => void,

  // Preview:
  hotReloadPreviewButtonProps: HotReloadPreviewButtonProps,
|};

type State = {|
  setupGridOpen: boolean,
  scenePropertiesDialogOpen: boolean,
  layersListOpen: boolean,
  onCloseLayerRemoveDialog: ?(
    doRemove: boolean,
    newLayer: string | null
  ) => void,
  layerRemoved: ?string,
  editedLayer: ?gdLayer,
  editedLayerInitialTab: 'properties' | 'effects',
  exportedObject: ?gdObject,
  editedObjectWithContext: ?ObjectWithContext,
  editedObjectInitialTab: ?ObjectEditorTab,
  variablesEditedInstance: ?gdInitialInstance,
  newObjectInstanceSceneCoordinates: ?[number, number],
  invisibleLayerOnWhichInstancesHaveJustBeenAdded: string | null,

  editedGroup: ?gdObjectGroup,

  instancesEditorSettings: InstancesEditorSettings,
  history: HistoryState,

  layoutVariablesDialogOpen: boolean,
  showAdditionalWorkInfoBar: boolean,
  additionalWorkInfoBar: InfoBarDetails,

  // State for tags of objects:
  selectedObjectTags: SelectedTags,

  renamedObjectWithContext: ?ObjectWithContext,
  selectedObjectsWithContext: Array<ObjectWithContext>,
  selectedLayer: string,

  isInAnimationMode: ?boolean,
  preAnimationState: ?Object
|};

type CopyCutPasteOptions = {|
  useLastCursorPosition?: boolean,
  pasteInTheForeground?: boolean,
|};

export default class SceneEditor extends React.Component<Props, State> {
  static defaultProps = {
    setToolbar: () => {},
  };

  theatreHelper: TheatreHelper;
  instancesSelection: InstancesSelection;
  contextMenu: ?ContextMenuInterface;
  editorDisplay: ?SceneEditorsDisplayInterface;

  constructor(props: Props) {
    super(props);

    this.instancesSelection = new InstancesSelection();
    this.theatreHelper = new TheatreHelper(props.project, this.instancesSelection, this.props.initialInstances, () => this.forceUpdatePropertiesEditor());
    this.theatreHelper.onSelectionChange(this.onSelectionChange.bind(this));
    this.theatreHelper.initialize();
    this.state = {
      setupGridOpen: false,
      scenePropertiesDialogOpen: false,
      layersListOpen: false,
      onCloseLayerRemoveDialog: null,
      layerRemoved: null,
      editedLayer: null,
      editedLayerInitialTab: 'properties',
      exportedObject: null,
      editedObjectWithContext: null,
      editedObjectInitialTab: 'properties',
      variablesEditedInstance: null,
      newObjectInstanceSceneCoordinates: null,
      editedGroup: null,

      instancesEditorSettings: props.getInitialInstancesEditorSettings(),
      history: getHistoryInitialState(props.initialInstances, {
        historyMaxSize: 50,
      }),

      layoutVariablesDialogOpen: false,

      showAdditionalWorkInfoBar: false,
      additionalWorkInfoBar: {
        identifier: 'default-additional-work',
        message: '',
        touchScreenMessage: '',
      },

      selectedObjectTags: [],

      renamedObjectWithContext: null,
      selectedObjectsWithContext: [],
      selectedLayer: BASE_LAYER_NAME,
      invisibleLayerOnWhichInstancesHaveJustBeenAdded: null,
      isInAnimationMode: false,
    };
  }

  onSelectionChange(oldSelection: SelectionDataT, newSelection: SelectionDataT) {
    // if (oldSelection.length && newSelection.length) return;
    if (!oldSelection.length && !newSelection.length) return;

    console.log(oldSelection, newSelection)

    if (oldSelection.length) {
      this.instancesSelection.clearSelection();
      unserializeFromJSObject(
        this.props.initialInstances,
        this.state.preAnimationState,
        'unserializeFrom'
      );

      console.log(this.state.preAnimationState)
      
      if (!newSelection.length) {
        this.setState({
          history: saveToHistory(this.state.history, this.props.initialInstances),
          preAnimationState: null,
          isInAnimationMode: false,
        }, () => {
          if (this.editorDisplay)
            this.editorDisplay.instancesHandlers.forceRemountInstancesRenderers();
          this.updateToolbar();
        });
      } else {
        if (this.editorDisplay) this.editorDisplay.instancesHandlers.forceRemountInstancesRenderers();
        this.updateToolbar();
      }
    } else {
      const history = this.state.history || saveToHistory(this.state.history, this.props.initialInstances);
      const preAnimationState = history.currentValue;
   
      this.setState({
        history,
        isInAnimationMode: true,
        preAnimationState
      }, () => {
        this.updateToolbar();
      });
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.history !== prevState.history)
      if (this.props.unsavedChanges)
        this.props.unsavedChanges.triggerUnsavedChanges();
  }

  getInstancesEditorSettings() {
    return this.state.instancesEditorSettings;
  }

  updateToolbar = () => {
    const { editorDisplay } = this;
    if (!editorDisplay) return;

    if (editorDisplay.getName() === 'mosaic') {
      this.props.setToolbar(
        <MosaicEditorsDisplayToolbar
          instancesSelection={this.instancesSelection}
          toggleObjectsList={this.toggleObjectsList}
          isObjectsListShown={editorDisplay.isEditorVisible('objects-list')}
          toggleObjectGroupsList={this.toggleObjectGroupsList}
          isObjectGroupsListShown={editorDisplay.isEditorVisible(
            'object-groups-list'
          )}
          toggleProperties={this.toggleProperties}
          isPropertiesShown={editorDisplay.isEditorVisible('properties')}
          deleteSelection={this.deleteSelection}
          toggleInstancesList={this.toggleInstancesList}
          isInstancesListShown={editorDisplay.isEditorVisible('instances-list')}
          toggleLayersList={this.toggleLayersList}
          isLayersListShown={editorDisplay.isEditorVisible('layers-list')}
          toggleWindowMask={this.toggleWindowMask}
          isWindowMaskShown={() =>
            !!this.state.instancesEditorSettings.windowMask
          }
          toggleGrid={this.toggleGrid}
          isGridShown={() => !!this.state.instancesEditorSettings.grid}
          openSetupGrid={this.openSetupGrid}
          setZoomFactor={this.setZoomFactor}
          getContextMenuZoomItems={this.getContextMenuZoomItems}
          canUndo={canUndo(this.state.history)}
          canRedo={canRedo(this.state.history)}
          undo={this.undo}
          redo={this.redo}
          onOpenSettings={this.openSceneProperties}
          settingsIcon={<EditSceneIcon />}
          canRenameObject={this.state.selectedObjectsWithContext.length === 1}
          onRenameObject={this._startRenamingSelectedObject}
        />
      );
    } else {
      this.props.setToolbar(
        <SwipeableDrawerEditorsDisplayToolbar
          instancesSelection={this.instancesSelection}
          toggleObjectsList={this.toggleObjectsList}
          toggleObjectGroupsList={this.toggleObjectGroupsList}
          toggleProperties={this.toggleProperties}
          deleteSelection={this.deleteSelection}
          toggleInstancesList={this.toggleInstancesList}
          toggleLayersList={this.toggleLayersList}
          toggleWindowMask={this.toggleWindowMask}
          isWindowMaskShown={() =>
            !!this.state.instancesEditorSettings.windowMask
          }
          toggleGrid={this.toggleGrid}
          isGridShown={() => !!this.state.instancesEditorSettings.grid}
          openSetupGrid={this.openSetupGrid}
          setZoomFactor={this.setZoomFactor}
          getContextMenuZoomItems={this.getContextMenuZoomItems}
          canUndo={canUndo(this.state.history)}
          canRedo={canRedo(this.state.history)}
          undo={this.undo}
          redo={this.redo}
          onOpenSettings={this.openSceneProperties}
          settingsIcon={<EditSceneIcon />}
          canRenameObject={this.state.selectedObjectsWithContext.length === 1}
          onRenameObject={this._startRenamingSelectedObject}
        />
      );
    }
  };

  // To be updated, see https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops.
  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (
      this.props.layout !== nextProps.layout ||
      this.props.initialInstances !== nextProps.initialInstances ||
      this.props.project !== nextProps.project
    ) {
      this.instancesSelection.clearSelection();
      this.openSetupGrid(false);
      this.editInstanceVariables(null);
      this.openSceneProperties(false);
    }
  }

  toggleObjectsList = () => {
    if (!this.editorDisplay) return;
    this.editorDisplay.toggleEditorView('objects-list');
  };

  toggleProperties = () => {
    if (!this.editorDisplay) return;
    this.editorDisplay.toggleEditorView('properties');
  };

  toggleObjectGroupsList = () => {
    if (!this.editorDisplay) return;
    this.editorDisplay.toggleEditorView('object-groups-list');
  };

  toggleInstancesList = () => {
    if (!this.editorDisplay) return;
    this.editorDisplay.toggleEditorView('instances-list');
  };

  toggleLayersList = () => {
    if (!this.editorDisplay) return;
    this.editorDisplay.toggleEditorView('layers-list');
  };

  toggleWindowMask = () => {
    this.setState({
      instancesEditorSettings: {
        ...this.state.instancesEditorSettings,
        windowMask: !this.state.instancesEditorSettings.windowMask,
      },
    });
  };

  toggleGrid = () => {
    this.setState({
      instancesEditorSettings: {
        ...this.state.instancesEditorSettings,
        grid: !this.state.instancesEditorSettings.grid,
        snap: !this.state.instancesEditorSettings.grid,
      },
    });
  };

  openSetupGrid = (open: boolean = true) => {
    this.setState({ setupGridOpen: open });
  };

  openSceneProperties = (open: boolean = true) => {
    this.setState({ scenePropertiesDialogOpen: open });
  };

  openObjectEditor = () => {
    if (!this.instancesSelection.hasSelectedInstances()) {
      return;
    }
    const selectedInstanceObjectName = this.instancesSelection
      .getSelectedInstances()[0]
      .getObjectName();
    this.editObjectByName(selectedInstanceObjectName);
  };

  editLayerEffects = (layer: ?gdLayer) => {
    this.setState({ editedLayer: layer, editedLayerInitialTab: 'effects' });
  };

  editLayer = (layer: ?gdLayer) => {
    this.setState({ editedLayer: layer, editedLayerInitialTab: 'properties' });
  };

  editInstanceVariables = (instance: ?gdInitialInstance) => {
    this.setState({ variablesEditedInstance: instance });
  };

  editLayoutVariables = (open: boolean = true) => {
    this.setState({ layoutVariablesDialogOpen: open });
  };

  editObject = (editedObject: ?gdObject, initialTab: ?ObjectEditorTab) => {
    const { project } = this.props;
    if (editedObject) {
      this.setState({
        editedObjectWithContext: {
          object: editedObject,
          global: project.hasObjectNamed(editedObject.getName()),
        },
        editedObjectInitialTab: initialTab || 'properties',
      });
    } else {
      this.setState({
        editedObjectWithContext: null,
        editedObjectInitialTab: 'properties',
      });
    }
  };

  openObjectExporterDialog = (object: ?gdObject) => {
    this.setState({
      exportedObject: object,
    });
  };

  editObjectByName = (objectName: string, initialTab?: ObjectEditorTab) => {
    const { project, layout } = this.props;
    if (layout.hasObjectNamed(objectName))
      this.editObject(layout.getObject(objectName), initialTab);
    else if (project.hasObjectNamed(objectName))
      this.editObject(project.getObject(objectName), initialTab);
  };

  editGroup = (group: ?gdObjectGroup) => {
    this.setState({ editedGroup: group });
  };

  setInstancesEditorSettings = (
    instancesEditorSettings: InstancesEditorSettings
  ) => {
    this.setState({
      instancesEditorSettings,
    });
  };

  /**
   * Debounced version of `setInstancesEditorSettings` to be called when the
   * settings have been mutated. The `InstancesEditor` can mutate these settings
   * very quickly (the zoom factor changes 60 times per second when the user does a
   * "pinch to zoom"). In this case, we don't want to have the React updates to be a
   * bottleneck. We let the mutations be done and trigger an update only when the user
   * is done.
   */
  _onInstancesEditorSettingsMutated = debounce(
    (instancesEditorSettings: InstancesEditorSettings) => {
      this.setInstancesEditorSettings(instancesEditorSettings);
    },
    1000,
    { leading: false, trailing: true }
  );

  undo = () => {
    // TODO: Do not clear selection so that the user can actually see
    // the changes it is undoing (variable change, instance moved, etc.)
    // or find a way to display a sumup of the change such as "Variable XXX
    // in instance of Enemy changed to YYY"
    this.instancesSelection.clearSelection();
    this.setState(
      {
        history: undo(this.state.history, this.props.initialInstances),
      },
      () => {
        // /!\ Force the instances editor to destroy and mount again the
        // renderers to avoid keeping any references to existing instances
        if (this.editorDisplay)
          this.editorDisplay.instancesHandlers.forceRemountInstancesRenderers();
        this.updateToolbar();
      }
    );
  };

  redo = () => {
    this.instancesSelection.clearSelection();
    this.setState(
      {
        history: redo(this.state.history, this.props.initialInstances),
      },
      () => {
        // /!\ Force the instances editor to destroy and mount again the
        // renderers to avoid keeping any references to existing instances
        if (this.editorDisplay)
          this.editorDisplay.instancesHandlers.forceRemountInstancesRenderers();
        this.updateToolbar();
      }
    );
  };

  _onObjectSelected = (objectWithContext: ?ObjectWithContext = null) => {
    const selectedObjectsWithContext = [];
    if (objectWithContext) {
      selectedObjectsWithContext.push(objectWithContext);
    }

    this.setState(
      {
        selectedObjectsWithContext,
      },
      () => {
        // We update the toolbar because we need to update the objects selected
        // (for the rename shortcut)
        this.updateToolbar();
      }
    );
  };

  _createNewObjectAndInstanceUnderCursor = () => {
    if (!this.editorDisplay) {
      return;
    }

    // Remember where to create the instance, when the object will be created
    this.setState({
      newObjectInstanceSceneCoordinates: this.editorDisplay.viewControls.getLastCursorSceneCoordinates(),
    });

    if (this.editorDisplay) this.editorDisplay.openNewObjectDialog();
    else this.toggleObjectsList();
  };

  addInstanceOnTheScene = (
    objectName: string,
    targetPosition: 'center' | 'upperCenter' = 'center'
  ) => {
    if (!this.editorDisplay) {
      return;
    }
    const viewPosition = this.editorDisplay.viewControls.getViewPosition();
    let position = [0, 0];
    if (viewPosition) {
      position = viewPosition.toSceneCoordinates(
        viewPosition.getWidth() / 2,
        viewPosition.getHeight() /
          // If the target position is the upper center, the Y position is at the first
          // quarter of the screen. Otherwise, it's at the half of the screen.
          (targetPosition === 'upperCenter' ? 4 : 2)
      );
    }
    this._addInstance(position, objectName);
  };

  _addInstance = (pos: [number, number], objectName: string) => {
    if (!objectName || !this.editorDisplay) return;

    const instances = this.editorDisplay.instancesHandlers.addInstances(
      pos,
      [objectName],
      this.state.selectedLayer
    );
    this._onInstancesAdded(instances);
  };

  _onInstancesAdded = (instances: Array<gdInitialInstance>) => {
    let invisibleLayerOnWhichInstancesHaveJustBeenAdded = null;
    instances.forEach(instance => {
      if (invisibleLayerOnWhichInstancesHaveJustBeenAdded === null) {
        const layer = this.props.layout.getLayer(instance.getLayer());
        if (!layer.getVisibility()) {
          invisibleLayerOnWhichInstancesHaveJustBeenAdded = instance.getLayer();
        }
      }
      const infoBarDetails = onInstanceAdded(
        instance,
        this.props.layout,
        this.props.project
      );
      if (infoBarDetails) {
        this.setState({
          additionalWorkInfoBar: infoBarDetails,
          showAdditionalWorkInfoBar: true,
        });
      }
    });
    if (invisibleLayerOnWhichInstancesHaveJustBeenAdded !== null) {
      this.onInstanceAddedOnInvisibleLayer(
        invisibleLayerOnWhichInstancesHaveJustBeenAdded
      );
    }

    this.setState(
      {
        history: saveToHistory(
          this.state.history,
          this.props.initialInstances,
          'ADD'
        ),
      },
      () => this.updateToolbar()
    );
  };

  onInstanceAddedOnInvisibleLayer = (layer: ?string) => {
    this.setState({ invisibleLayerOnWhichInstancesHaveJustBeenAdded: layer });
  };

  _onInstancesSelected = (instances: Array<gdInitialInstance>) => {
    const { project, layout } = this.props;
    const instancesObjectNames = uniq(
      instances.map(instance => instance.getObjectName())
    );
    this.theatreHelper.onInstancesSelected(instances);

    const selectedObjectsWithContext = enumerateObjects(project, layout, {
      names: instancesObjectNames,
    }).allObjectsList;

    this.setState(
      {
        selectedObjectsWithContext,
      },
      () => {
        this.updateToolbar();
      }
    );
  };

  _onInstanceDoubleClicked = (instance: gdInitialInstance) => {
    this.editObjectByName(instance.getObjectName());
  };

  _onInstancesMoved = (instances: Array<gdInitialInstance>) => {
    this.theatreHelper.onInstancesMoved(instances);

    this.setState(
      {
        history: saveToHistory(
          this.state.history,
          this.props.initialInstances,
          'EDIT'
        ),
      },
      () => this.forceUpdatePropertiesEditor()
    );
  };

  _onInstancesResized = (instances: Array<gdInitialInstance>) => {
    this.setState(
      {
        history: saveToHistory(
          this.state.history,
          this.props.initialInstances,
          'EDIT'
        ),
      },
      () => this.forceUpdatePropertiesEditor()
    );
  };

  _onInstancesRotated = (instances: Array<gdInitialInstance>) => {
    this.setState(
      {
        history: saveToHistory(
          this.state.history,
          this.props.initialInstances,
          'EDIT'
        ),
      },
      () => this.forceUpdatePropertiesEditor()
    );
  };

  _onInstancesModified = (instances: Array<gdInitialInstance>) => {
    this.forceUpdate();

    this.theatreHelper._onInstancesModified(instances);
    //TODO: Save for redo with debounce (and cancel on unmount)
  };

  _onSelectInstances = (
    instances: Array<gdInitialInstance>,
    multiSelect: boolean,
    targetPosition?: 'center' | 'upperCenter'
  ) => {
    this.instancesSelection.selectInstances({
      instances,
      multiSelect,
      layersLocks: null,
      ignoreSeal: true,
    });
    if (this.editorDisplay) {
      let offset = null;
      const { viewControls } = this.editorDisplay;
      const viewPosition = viewControls.getViewPosition();
      if (viewPosition && targetPosition === 'upperCenter') {
        offset = [0, viewPosition.toSceneScale(viewPosition.getHeight() / 4)];
      }

      viewControls.centerViewOnLastInstance(instances, offset);
    }
    this.updateToolbar();
  };

  /**
   * Create an instance of the given object, at the position
   * previously chosen (see `newObjectInstanceSceneCoordinates`).
   */
  _addInstanceForNewObject = (newObjectName: string) => {
    const { newObjectInstanceSceneCoordinates } = this.state;
    if (!newObjectInstanceSceneCoordinates) {
      return;
    }

    this._addInstance(newObjectInstanceSceneCoordinates, newObjectName);
    this.setState({ newObjectInstanceSceneCoordinates: null });
  };

  _onObjectCreated = (object: gdObject) => {
    const infoBarDetails = onObjectAdded(
      object,
      this.props.layout,
      this.props.project
    );
    if (infoBarDetails) {
      this.setState({
        additionalWorkInfoBar: infoBarDetails,
        showAdditionalWorkInfoBar: true,
      });
    }
    if (this.props.unsavedChanges)
      this.props.unsavedChanges.triggerUnsavedChanges();

    this._addInstanceForNewObject(object.getName());
  };

  _onRemoveLayer = (layerName: string, done: boolean => void) => {
    const getNewState = (doRemove: boolean) => {
      const newState: {| layerRemoved: null, selectedLayer?: string |} = {
        layerRemoved: null,
      };
      if (doRemove && layerName === this.state.selectedLayer) {
        newState.selectedLayer = BASE_LAYER_NAME;
      }
      return newState;
    };

    this.setState({
      layerRemoved: layerName,
      onCloseLayerRemoveDialog: (
        doRemove: boolean,
        newLayer: string | null
      ) => {
        this.setState(getNewState(doRemove), () => {
          if (doRemove) {
            if (newLayer === null) {
              this.instancesSelection.unselectInstancesOnLayer(layerName);
              gd.WholeProjectRefactorer.removeLayer(
                this.props.project,
                this.props.layout,
                layerName
              );
            } else {
              // Instances are not invalidated, so we can keep the selection.
              gd.WholeProjectRefactorer.mergeLayers(
                this.props.project,
                this.props.layout,
                layerName,
                newLayer
              );
            }
          }

          done(doRemove);
          // /!\ Force the instances editor to destroy and mount again the
          // renderers to avoid keeping any references to existing instances
          if (this.editorDisplay)
            this.editorDisplay.instancesHandlers.forceRemountInstancesRenderers();

          this.forceUpdateLayersList();

          // We may have modified the selection, so force an update of editors dealing with it.
          this.forceUpdatePropertiesEditor();
          this.updateToolbar();
        });
      },
    });
  };

  _onRenameObjectStart = (objectWithContext: ?ObjectWithContext) => {
    const selectedObjectsWithContext = [];
    if (objectWithContext) {
      selectedObjectsWithContext.push(objectWithContext);
    }

    this.setState(
      {
        renamedObjectWithContext: objectWithContext,
        selectedObjectsWithContext,
      },
      () => {
        this.updateToolbar();
      }
    );
  };

  _startRenamingSelectedObject = () => {
    this._onRenameObjectStart(this.state.selectedObjectsWithContext[0]);
  };

  _onRenameLayer = (
    oldName: string,
    newName: string,
    done: boolean => void
  ) => {
    this.props.initialInstances.moveInstancesToLayer(oldName, newName);
    done(true);
    this.forceUpdatePropertiesEditor();
  };

  _onDeleteObject = (
    i18n: I18nType,
    objectWithContext: ObjectWithContext,
    done: boolean => void
  ) => {
    const { object, global } = objectWithContext;
    const { project, layout } = this.props;

    const answer = Window.showYesNoCancelDialog(
      i18n._(
        t`Do you want to remove all references to this object in groups and events (actions and conditions using the object)?`
      )
    );

    if (answer === 'cancel') return;
    const shouldRemoveReferences = answer === 'yes';

    // Unselect instances of the deleted object because these instances
    // will be deleted by gd.WholeProjectRefactorer (and after that, they will
    // be invalid references, as pointing to deleted objects).
    this.instancesSelection.unselectInstancesOfObject(object.getName());

    if (global) {
      gd.WholeProjectRefactorer.globalObjectOrGroupRemoved(
        project,
        object.getName(),
        /* isObjectGroup=*/ false,
        shouldRemoveReferences
      );
    } else {
      gd.WholeProjectRefactorer.objectOrGroupRemovedInLayout(
        project,
        layout,
        object.getName(),
        /* isObjectGroup=*/ false,
        shouldRemoveReferences
      );
    }

    done(true);

    // We modified the selection, so force an update of editors dealing with it.
    this.forceUpdatePropertiesEditor();
    this.updateToolbar();
  };

  _getValidatedObjectOrGroupName = (
    newName: string,
    global: boolean,
    i18n: I18nType
  ) => {
    const { project, layout } = this.props;

    const safeAndUniqueNewName = newNameGenerator(
      gd.Project.getSafeName(newName),
      tentativeNewName => {
        if (
          layout.hasObjectNamed(tentativeNewName) ||
          project.hasObjectNamed(tentativeNewName) ||
          layout.getObjectGroups().has(tentativeNewName) ||
          project.getObjectGroups().has(tentativeNewName)
        ) {
          return true;
        }

        if (global) {
          // If object or group is global, also check for other layouts' objects and groups names.
          const layoutName = layout.getName();
          const layoutsWithObjectOrGroupWithSameName: Array<string> = mapFor(
            0,
            project.getLayoutsCount(),
            i => {
              const otherLayout = project.getLayoutAt(i);
              const otherLayoutName = otherLayout.getName();
              if (layoutName !== otherLayoutName) {
                if (otherLayout.hasObjectNamed(tentativeNewName)) {
                  return otherLayoutName;
                }
                const groupContainer = otherLayout.getObjectGroups();
                if (groupContainer.has(tentativeNewName)) {
                  return otherLayoutName;
                }
              }
              return null;
            }
          ).filter(Boolean);

          if (layoutsWithObjectOrGroupWithSameName.length > 0) {
            return true;
          }
        }

        return false;
      }
    );

    return safeAndUniqueNewName;
  };

  _onRenameEditedObject = (newName: string) => {
    const { editedObjectWithContext } = this.state;

    if (editedObjectWithContext) {
      this._onRenameObjectFinish(editedObjectWithContext, newName, () => {});
    }
  };

  _onRenameObjectFinish = (
    objectWithContext: ObjectWithContext,
    newName: string,
    done: boolean => void
  ) => {
    const { object, global } = objectWithContext;
    const { project, layout } = this.props;

    // newName is supposed to have been already validated.

    // Avoid triggering renaming refactoring if name has not really changed
    if (object.getName() !== newName) {
      if (global) {
        gd.WholeProjectRefactorer.globalObjectOrGroupRenamed(
          project,
          object.getName(),
          newName,
          /* isObjectGroup=*/ false
        );
      } else {
        gd.WholeProjectRefactorer.objectOrGroupRenamedInLayout(
          project,
          layout,
          object.getName(),
          newName,
          /* isObjectGroup=*/ false
        );
      }
    }

    object.setName(newName);
    this._onObjectSelected(objectWithContext);
    done(true);
  };

  _onMoveInstancesZOrder = (where: 'front' | 'back') => {
    const selectedInstances = this.instancesSelection.getSelectedInstances();

    const layerNames = selectedInstances.reduce(
      (acc: Set<string>, instance) => {
        if (!instance.isLocked()) acc.add(instance.getLayer());
        return acc;
      },
      new Set()
    );

    const highestZOrderFinder = new gd.HighestZOrderFinder();

    const extremeZOrderByLayerName = {};
    layerNames.forEach(layerName => {
      highestZOrderFinder.reset();
      highestZOrderFinder.restrictSearchToLayer(layerName);
      this.props.initialInstances.iterateOverInstances(highestZOrderFinder);
      extremeZOrderByLayerName[layerName] =
        where === 'back'
          ? highestZOrderFinder.getLowestZOrder()
          : highestZOrderFinder.getHighestZOrder();
    });
    highestZOrderFinder.delete();

    selectedInstances.forEach(instance => {
      if (!instance.isLocked()) {
        const extremeZOrder = extremeZOrderByLayerName[instance.getLayer()];
        // If instance is already at the extreme z order, do nothing.
        if (instance.getZOrder() === extremeZOrder) return;

        instance.setZOrder(extremeZOrder + (where === 'front' ? 1 : -1));
      }
    });
    this.forceUpdateInstancesList();
    this.forceUpdatePropertiesEditor();
  };

  _onDeleteGroup = (
    groupWithContext: GroupWithContext,
    done: boolean => void
  ) => {
    const { group, global } = groupWithContext;
    const { project, layout } = this.props;

    const answer = Window.showConfirmDialog(
      'Do you want to remove all references to this group in events (actions and conditions using the group)?'
    );

    if (global) {
      gd.WholeProjectRefactorer.globalObjectOrGroupRemoved(
        project,
        group.getName(),
        /* isObjectGroup=*/ true,
        !!answer
      );
    } else {
      gd.WholeProjectRefactorer.objectOrGroupRemovedInLayout(
        project,
        layout,
        group.getName(),
        /* isObjectGroup=*/ true,
        !!answer
      );
    }

    done(true);
  };

  _onRenameGroup = (
    groupWithContext: GroupWithContext,
    newName: string,
    done: boolean => void
  ) => {
    const { group, global } = groupWithContext;
    const { project, layout } = this.props;

    // newName is supposed to have been already validated

    // Avoid triggering renaming refactoring if name has not really changed
    if (group.getName() !== newName) {
      if (global) {
        gd.WholeProjectRefactorer.globalObjectOrGroupRenamed(
          project,
          group.getName(),
          newName,
          /* isObjectGroup=*/ true
        );
      } else {
        gd.WholeProjectRefactorer.objectOrGroupRenamedInLayout(
          project,
          layout,
          group.getName(),
          newName,
          /* isObjectGroup=*/ true
        );
      }
    }

    done(true);
  };

  canObjectOrGroupBeGlobal = (
    i18n: I18nType,
    objectOrGroupName: string
  ): boolean => {
    const { layout, project } = this.props;
    const layoutName = layout.getName();
    const layoutsWithObjectOrGroupWithSameName: Array<string> = mapFor(
      0,
      project.getLayoutsCount(),
      i => {
        const otherLayout = project.getLayoutAt(i);
        const otherLayoutName = otherLayout.getName();
        if (layoutName !== otherLayoutName) {
          if (otherLayout.hasObjectNamed(objectOrGroupName)) {
            return otherLayoutName;
          }
          const groupContainer = otherLayout.getObjectGroups();
          if (groupContainer.has(objectOrGroupName)) {
            return otherLayoutName;
          }
        }
        return null;
      }
    ).filter(Boolean);

    if (layoutsWithObjectOrGroupWithSameName.length > 0) {
      return Window.showConfirmDialog(
        i18n._(
          t`Making "${objectOrGroupName}" global would conflict with the following scenes that have a group or an object with the same name:${'\n\n - ' +
            layoutsWithObjectOrGroupWithSameName.join('\n\n - ') +
            '\n\n'}Continue only if you know what you're doing.`
        ),
        'warning'
      );
    }
    return true;
  };

  deleteSelection = () => {
    const selectedInstances = this.instancesSelection.getSelectedInstances();
    selectedInstances.forEach(instance => {
      if (instance.isLocked()) return;
      this.props.initialInstances.removeInstance(instance);
    });

    this.instancesSelection.clearSelection();
    if (this.editorDisplay)
      this.editorDisplay.instancesHandlers.clearHighlightedInstance();

    this.setState(
      {
        selectedObjectsWithContext: [],
        history: saveToHistory(
          this.state.history,
          this.props.initialInstances,
          'DELETE'
        ),
      },
      () => {
        this.updateToolbar();
        this.forceUpdatePropertiesEditor();
      }
    );
  };

  zoomToInitialPosition = () => {
    if (this.editorDisplay)
      this.editorDisplay.viewControls.zoomToInitialPosition();
  };

  zoomToFitContent = () => {
    if (this.editorDisplay) this.editorDisplay.viewControls.zoomToFitContent();
  };

  zoomToFitSelection = () => {
    const selectedInstances = this.instancesSelection.getSelectedInstances();
    if (this.editorDisplay)
      this.editorDisplay.viewControls.zoomToFitSelection(selectedInstances);
  };

  getContextMenuZoomItems = (i18n: I18nType) => {
    return [
      {
        label: i18n._(t`Zoom in`),
        click: this.zoomIn,
        accelerator: 'CmdOrCtrl+numadd',
      },
      {
        label: i18n._(t`Zoom out`),
        click: this.zoomOut,
        accelerator: 'CmdOrCtrl+numsub',
      },
      {
        label: i18n._(t`Zoom to fit selection`),
        click: this.zoomToFitSelection,
        enabled: this.instancesSelection.hasSelectedInstances(),
        accelerator: 'Shift+num1',
      },
      {
        label: i18n._(t`Zoom to initial position`),
        click: this.zoomToInitialPosition,
        accelerator: 'Shift+num2',
      },
      {
        label: i18n._(t`Zoom to fit content`),
        click: this.zoomToFitContent,
        accelerator: 'Shift+num3',
      },
    ];
  };

  setZoomFactor = (zoomFactor: number) => {
    if (this.editorDisplay)
      this.editorDisplay.viewControls.setZoomFactor(zoomFactor);
  };

  zoomIn = () => {
    if (this.editorDisplay)
      this.editorDisplay.viewControls.zoomBy(zoomInFactor);
  };

  zoomOut = () => {
    if (this.editorDisplay)
      this.editorDisplay.viewControls.zoomBy(zoomOutFactor);
  };

  _onContextMenu = (
    x: number,
    y: number,
    ignoreSelectedObjectsForContextMenu?: boolean = false
  ) => {
    if (this.contextMenu)
      this.contextMenu.open(x, y, {
        ignoreSelectedObjectsForContextMenu: !!ignoreSelectedObjectsForContextMenu,
      });
  };

  isInstanceOf3DObject = (instance: gdInitialInstance) => {
    const { project, layout } = this.props;

    const object = getObjectByName(project, layout, instance.getObjectName());
    return !!object && object.is3DObject();
  };

  buildContextMenu = (i18n: I18nType, layout: gdLayout, options: any) => {
    let contextMenuItems = [];
    if (
      options.ignoreSelectedObjectsForContextMenu ||
      this.state.selectedObjectsWithContext.length === 0
    ) {
      contextMenuItems = [
        ...contextMenuItems,
        {
          label: i18n._(t`Paste`),
          click: () => this.paste(),
          enabled: Clipboard.has(INSTANCES_CLIPBOARD_KIND),
          accelerator: 'CmdOrCtrl+V',
        },
        { type: 'separator' },
        {
          label: i18n._(t`Insert new...`),
          click: () => this._createNewObjectAndInstanceUnderCursor(),
        },
        { type: 'separator' },
        ...this.getContextMenuZoomItems(i18n),
      ];
    } else {
      const objectName = this.state.selectedObjectsWithContext[0].object.getName();
      contextMenuItems = [
        ...contextMenuItems,
        {
          label: i18n._(t`Copy`),
          click: () => this.copySelection(),
          enabled: this.instancesSelection.hasSelectedInstances(),
          accelerator: 'CmdOrCtrl+C',
        },
        {
          label: i18n._(t`Cut`),
          click: () => this.cutSelection(),
          enabled: this.instancesSelection.hasSelectedInstances(),
          accelerator: 'CmdOrCtrl+X',
        },
        {
          label: i18n._(t`Paste`),
          click: () => this.paste(),
          enabled: Clipboard.has(INSTANCES_CLIPBOARD_KIND),
          accelerator: 'CmdOrCtrl+V',
        },
        {
          label: i18n._(t`Duplicate`),
          enabled: this.instancesSelection.hasSelectedInstances(),
          click: () => {
            this.duplicateSelection();
          },
          accelerator: 'CmdOrCtrl+D',
        },
        { type: 'separator' },
        {
          label: i18n._(t`Bring to front`),
          enabled: this.instancesSelection.hasSelectedInstances(),
          click: () => {
            this._onMoveInstancesZOrder('front');
          },
        },
        {
          label: i18n._(t`Send to back`),
          enabled: this.instancesSelection.hasSelectedInstances(),
          click: () => {
            this._onMoveInstancesZOrder('back');
          },
        },
        { type: 'separator' },
        {
          label: i18n._(t`Show/Hide instance properties`),
          click: () => this.toggleProperties(),
          enabled: this.instancesSelection.hasSelectedInstances(),
        },
        {
          label: i18n._(t`Delete`),
          click: () => this.deleteSelection(),
          enabled: this.instancesSelection.hasSelectedInstances(),
          accelerator: 'Delete',
        },
        { type: 'separator' },
        {
          label: i18n._(t`Edit object ${shortenString(objectName, 14)}`),
          click: () => this.editObjectByName(objectName, 'properties'),
        },
        {
          label: i18n._(t`Edit object variables`),
          click: () => this.editObjectByName(objectName, 'variables'),
        },
        {
          label: i18n._(t`Edit behaviors`),
          click: () => this.editObjectByName(objectName, 'behaviors'),
        },
        {
          label: i18n._(t`Edit effects`),
          click: () => this.editObjectByName(objectName, 'effects'),
        },
      ];
    }

    contextMenuItems = [
      ...contextMenuItems,
      { type: 'separator' },
      {
        label: i18n._(t`Open scene events`),
        click: () => this.props.onOpenEvents(layout.getName()),
      },
      {
        label: i18n._(t`Open scene properties`),
        click: () => this.openSceneProperties(true),
      },
    ];

    return contextMenuItems;
  };

  copySelection = ({
    useLastCursorPosition,
    pasteInTheForeground,
  }: CopyCutPasteOptions = {}) => {
    const serializedSelection = this.instancesSelection
      .getSelectedInstances()
      .map(instance => serializeToJSObject(instance));

    let x = 0;
    let y = 0;
    if (this.editorDisplay) {
      const selectionAABB = this.editorDisplay.instancesHandlers.getSelectionAABB();
      x = selectionAABB.centerX();
      y = selectionAABB.centerY();
    }

    if (this.editorDisplay) {
      Clipboard.set(INSTANCES_CLIPBOARD_KIND, {
        x,
        y,
        pasteInTheForeground: !!pasteInTheForeground,
        instances: serializedSelection,
      });
    }
  };

  cutSelection = ({ useLastCursorPosition }: CopyCutPasteOptions = {}) => {
    this.copySelection({ useLastCursorPosition, pasteInTheForeground: true });
    this.deleteSelection();
  };

  duplicateSelection = ({
    useLastCursorPosition,
  }: CopyCutPasteOptions = {}) => {
    const { editorDisplay } = this;
    if (!editorDisplay) return;
    const serializedSelection = this.instancesSelection
      .getSelectedInstances()
      .map(instance => serializeToJSObject(instance));

    const newInstances = editorDisplay.instancesHandlers.addSerializedInstances(
      {
        position: [0, 0],
        copyReferential: [-2 * MOVEMENT_BIG_DELTA, -2 * MOVEMENT_BIG_DELTA],
        serializedInstances: serializedSelection,
        preventSnapToGrid: true,
      }
    );
    this._onInstancesAdded(newInstances);
    this.instancesSelection.clearSelection();
    this.instancesSelection.selectInstances({
      instances: newInstances,
      multiSelect: true,
      layersLocks: null,
    });
    this.forceUpdatePropertiesEditor();
  };

  paste = ({ useLastCursorPosition }: CopyCutPasteOptions = {}) => {
    const { editorDisplay } = this;
    if (!editorDisplay) return;

    const position = useLastCursorPosition
      ? editorDisplay.viewControls.getLastCursorSceneCoordinates()
      : editorDisplay.viewControls.getLastContextMenuSceneCoordinates();

    const clipboardContent = Clipboard.get(INSTANCES_CLIPBOARD_KIND);
    const instancesContent = SafeExtractor.extractArrayProperty(
      clipboardContent,
      'instances'
    );
    const x = SafeExtractor.extractNumberProperty(clipboardContent, 'x');
    const y = SafeExtractor.extractNumberProperty(clipboardContent, 'y');
    const pasteInTheForeground =
      SafeExtractor.extractBooleanProperty(
        clipboardContent,
        'pasteInTheForeground'
      ) || false;
    if (x === null || y === null || instancesContent === null) return;
    const viewPosition = editorDisplay.viewControls.getViewPosition();
    if (!viewPosition) return;

    const newInstances = editorDisplay.instancesHandlers.addSerializedInstances(
      {
        position: viewPosition.containsPoint(position[0], position[1])
          ? position
          : [viewPosition.getViewX(), viewPosition.getViewY()],
        copyReferential: [x, y],
        serializedInstances: instancesContent,
        addInstancesInTheForeground: pasteInTheForeground,
      }
    );

    this._onInstancesAdded(newInstances);
    this.instancesSelection.clearSelection();
    this.instancesSelection.selectInstances({
      instances: newInstances,
      multiSelect: true,
      layersLocks: null,
    });
    this.forceUpdatePropertiesEditor();
  };

  onSelectAllInstancesOfObjectInLayout = (objectName: string) => {
    const { initialInstances } = this.props;
    const instancesToSelect = getInstancesInLayoutForObject(
      initialInstances,
      objectName
    );
    this.instancesSelection.selectInstances({
      instances: instancesToSelect,
      ignoreSeal: true,
      multiSelect: false,
      layersLocks: null,
    });
    this.forceUpdateInstancesList();
    this._onInstancesSelected(instancesToSelect);
  };

  updateBehaviorsSharedData = () => {
    const { layout, project } = this.props;
    layout.updateBehaviorsSharedData(project);
  };

  forceUpdateObjectsList = () => {
    if (this.editorDisplay) this.editorDisplay.forceUpdateObjectsList();
  };

  forceUpdateObjectGroupsList = () => {
    if (this.editorDisplay) this.editorDisplay.forceUpdateObjectGroupsList();
  };

  forceUpdateLayersList = () => {
    // The selected layer could have been deleted when editing a linked external layout.
    if (!this.props.layout.hasLayerNamed(this.state.selectedLayer)) {
      this.setState({ selectedLayer: BASE_LAYER_NAME });
    }
    if (this.editorDisplay) this.editorDisplay.forceUpdateLayersList();
  };

  forceUpdateInstancesList = () => {
    if (this.editorDisplay) this.editorDisplay.forceUpdateInstancesList();
  };

  forceUpdatePropertiesEditor = () => {
    if (this.editorDisplay)
      this.editorDisplay.forceUpdateInstancesPropertiesEditor();
  };

  reloadResourcesFor = (object: gdObject) => {
    const { project } = this.props;

    const resourcesInUse = new gd.ResourcesInUseHelper();
    object.getConfiguration().exposeResources(resourcesInUse);
    const objectResourceNames = resourcesInUse
      .getAllImages()
      .toNewVectorString()
      .toJSArray();
    resourcesInUse.delete();

    PixiResourcesLoader.loadTextures(
      project,
      objectResourceNames,
      () => {},
      () => {
        if (this.editorDisplay)
          this.editorDisplay.instancesHandlers.resetInstanceRenderersFor(
            object.getName()
          );
      }
    );
  };

  render() {
    const {
      project,
      layout,
      initialInstances,
      resourceManagementProps,
      isActive,
    } = this.props;
    const { editedObjectWithContext } = this.state;
    const variablesEditedAssociatedObjectName = this.state
      .variablesEditedInstance
      ? this.state.variablesEditedInstance.getObjectName()
      : null;
    const variablesEditedAssociatedObject = variablesEditedAssociatedObjectName
      ? getObjectByName(project, layout, variablesEditedAssociatedObjectName)
      : null;
    const selectedObjectNames = this.state.selectedObjectsWithContext.map(
      objWithContext => objWithContext.object.getName()
    );
    // Deactivate prettier on this variable to prevent spaces to be added by
    // line breaks.
    // prettier-ignore
    const infoBarMessage =
      this.state.invisibleLayerOnWhichInstancesHaveJustBeenAdded !== null ? (
        <Trans>
          You just added an instance to a hidden layer
          ("{this.state.invisibleLayerOnWhichInstancesHaveJustBeenAdded || (
            <Trans>Base layer</Trans>
          )}"). Open the layer panel to make it visible.
        </Trans>
      ) : null;

    return (
      <ResponsiveWindowMeasurer>
        {windowWidth => {
          const EditorsDisplay =
            windowWidth === 'small'
              ? SwipeableDrawerEditorsDisplay
              : MosaicEditorsDisplay;
          return (
            <div
              style={styles.container}
              id="scene-editor"
              data-active={isActive ? 'true' : undefined}
            >
              <UseSceneEditorCommands
                project={project}
                layout={layout}
                onEditObject={this.props.onEditObject || this.editObject}
                onEditObjectVariables={object => {
                  this.editObject(object, 'variables');
                }}
                onOpenSceneProperties={this.openSceneProperties}
                onOpenSceneVariables={this.editLayoutVariables}
                onEditObjectGroup={this.editGroup}
                onEditLayerEffects={this.editLayerEffects}
                onEditLayer={this.editLayer}
              />
              <EditorsDisplay
                ref={ref => (this.editorDisplay = ref)}
                project={project}
                layout={layout}
                initialInstances={initialInstances}
                instancesSelection={this.instancesSelection}
                onSelectInstances={this._onSelectInstances}
                onAddObjectInstance={this.addInstanceOnTheScene}
                selectedLayer={this.state.selectedLayer}
                editLayer={this.editLayer}
                editLayerEffects={this.editLayerEffects}
                editInstanceVariables={this.editInstanceVariables}
                editObjectByName={this.editObjectByName}
                selectedObjectNames={selectedObjectNames}
                renamedObjectWithContext={this.state.renamedObjectWithContext}
                onRenameLayer={this._onRenameLayer}
                onRemoveLayer={this._onRemoveLayer}
                onSelectLayer={(layer: string) =>
                  this.setState({ selectedLayer: layer })
                }
                onExportObject={this.openObjectExporterDialog}
                onDeleteObject={this._onDeleteObject}
                getValidatedObjectOrGroupName={
                  this._getValidatedObjectOrGroupName
                }
                onEditObjectGroup={this.editGroup}
                onDeleteObjectGroup={this._onDeleteGroup}
                onRenameObjectGroup={this._onRenameGroup}
                canObjectOrGroupBeGlobal={this.canObjectOrGroupBeGlobal}
                updateBehaviorsSharedData={this.updateBehaviorsSharedData}
                onEditObject={this.props.onEditObject || this.editObject}
                onRenameObjectStart={this._onRenameObjectStart}
                onRenameObjectFinish={this._onRenameObjectFinish}
                onObjectCreated={this._onObjectCreated}
                onObjectSelected={this._onObjectSelected}
                canInstallPrivateAsset={this.props.canInstallPrivateAsset}
                historyHandler={{
                  undo: this.undo,
                  redo: this.redo,
                  canUndo: () => canUndo(this.state.history),
                  canRedo: () => canRedo(this.state.history),
                  saveToHistory: () =>
                    this.setState({
                      history: saveToHistory(
                        this.state.history,
                        this.props.initialInstances
                      ),
                    }),
                }}
                instancesEditorShortcutsCallbacks={{
                  onCopy: () =>
                    this.copySelection({ useLastCursorPosition: true }),
                  onCut: () =>
                    this.cutSelection({ useLastCursorPosition: true }),
                  onPaste: () => this.paste({ useLastCursorPosition: true }),
                  onDuplicate: () =>
                    this.duplicateSelection({ useLastCursorPosition: true }),
                  onDelete: this.deleteSelection,
                  onUndo: this.undo,
                  onRedo: this.redo,
                  onZoomOut: this.zoomOut,
                  onZoomIn: this.zoomIn,
                  onShift1: this.zoomToFitSelection,
                  onShift2: this.zoomToInitialPosition,
                  onShift3: this.zoomToFitContent,
                }}
                onInstancesAdded={this._onInstancesAdded}
                onInstancesSelected={this._onInstancesSelected}
                onInstanceDoubleClicked={this._onInstanceDoubleClicked}
                onInstancesMoved={this._onInstancesMoved}
                onInstancesResized={this._onInstancesResized}
                onInstancesRotated={this._onInstancesRotated}
                isInstanceOf3DObject={this.isInstanceOf3DObject}
                onInstancesModified={this._onInstancesModified}
                onSelectAllInstancesOfObjectInLayout={
                  this.onSelectAllInstancesOfObjectInLayout
                }
                instancesEditorSettings={this.state.instancesEditorSettings}
                onInstancesEditorSettingsMutated={
                  this._onInstancesEditorSettingsMutated
                }
                onContextMenu={this._onContextMenu}
                resourceManagementProps={this.props.resourceManagementProps}
                hotReloadPreviewButtonProps={
                  this.props.hotReloadPreviewButtonProps
                }
                isActive={isActive}
                onOpenedEditorsChanged={this.updateToolbar}
              />
              <I18n>
                {({ i18n }) => (
                  <React.Fragment>
                    {editedObjectWithContext && (
                      <ObjectEditorDialog
                        open
                        object={editedObjectWithContext.object}
                        initialTab={this.state.editedObjectInitialTab}
                        project={project}
                        layout={layout}
                        resourceManagementProps={resourceManagementProps}
                        onComputeAllVariableNames={() => {
                          const { editedObjectWithContext } = this.state;
                          if (!editedObjectWithContext) return [];

                          return EventsRootVariablesFinder.findAllObjectVariables(
                            project.getCurrentPlatform(),
                            project,
                            layout,
                            editedObjectWithContext.object
                          );
                        }}
                        onCancel={() => {
                          if (editedObjectWithContext) {
                            this.reloadResourcesFor(
                              editedObjectWithContext.object
                            );
                          }
                          this.editObject(null);
                        }}
                        getValidatedObjectOrGroupName={newName =>
                          this._getValidatedObjectOrGroupName(
                            newName,
                            editedObjectWithContext.global,
                            i18n
                          )
                        }
                        onRename={newName => {
                          this._onRenameEditedObject(newName);
                        }}
                        onApply={() => {
                          if (editedObjectWithContext) {
                            this.reloadResourcesFor(
                              editedObjectWithContext.object
                            );
                          }
                          this.editObject(null);
                          this.updateBehaviorsSharedData();
                          this.forceUpdateObjectsList();

                          if (this.props.unsavedChanges)
                            this.props.unsavedChanges.triggerUnsavedChanges();
                        }}
                        hotReloadPreviewButtonProps={
                          this.props.hotReloadPreviewButtonProps
                        }
                        onUpdateBehaviorsSharedData={() =>
                          this.updateBehaviorsSharedData()
                        }
                        openBehaviorEvents={this.props.openBehaviorEvents}
                      />
                    )}
                  </React.Fragment>
                )}
              </I18n>
              {this.state.exportedObject && (
                <ObjectExporterDialog
                  object={this.state.exportedObject}
                  onClose={() => {
                    this.openObjectExporterDialog(null);
                  }}
                />
              )}
              {!!this.state.editedGroup && (
                <ObjectGroupEditorDialog
                  project={project}
                  group={this.state.editedGroup}
                  objectsContainer={layout}
                  globalObjectsContainer={project}
                  onCancel={() => this.editGroup(null)}
                  onApply={() => this.editGroup(null)}
                />
              )}
              {this.state.setupGridOpen && (
                <SetupGridDialog
                  instancesEditorSettings={this.state.instancesEditorSettings}
                  onChangeInstancesEditorSettings={
                    this.setInstancesEditorSettings
                  }
                  onCancel={() => this.openSetupGrid(false)}
                  onApply={() => this.openSetupGrid(false)}
                />
              )}
              {!!this.state.variablesEditedInstance &&
                !!variablesEditedAssociatedObject && (
                  <VariablesEditorDialog
                    open
                    variablesContainer={this.state.variablesEditedInstance.getVariables()}
                    inheritedVariablesContainer={variablesEditedAssociatedObject.getVariables()}
                    onCancel={() => this.editInstanceVariables(null)}
                    onApply={() => this.editInstanceVariables(null)}
                    emptyPlaceholderTitle={
                      <Trans>Add your first instance variable</Trans>
                    }
                    emptyPlaceholderDescription={
                      <Trans>
                        Instance variables overwrite the default values of the
                        variables of the object.
                      </Trans>
                    }
                    helpPagePath={'/all-features/variables/instance-variables'}
                    title={<Trans>Instance Variables</Trans>}
                    onEditObjectVariables={
                      variablesEditedAssociatedObject
                        ? () => {
                            this.editObject(
                              variablesEditedAssociatedObject,
                              'variables'
                            );
                            this.editInstanceVariables(null);
                          }
                        : undefined
                    }
                    hotReloadPreviewButtonProps={
                      this.props.hotReloadPreviewButtonProps
                    }
                    onComputeAllVariableNames={() => {
                      const { variablesEditedInstance } = this.state;
                      if (!variablesEditedInstance) {
                        return [];
                      }
                      const variablesEditedObject = getObjectByName(
                        project,
                        layout,
                        variablesEditedInstance.getObjectName()
                      );
                      return variablesEditedObject
                        ? EventsRootVariablesFinder.findAllObjectVariables(
                            project.getCurrentPlatform(),
                            project,
                            layout,
                            variablesEditedObject
                          )
                        : [];
                    }}
                  />
                )}
              {!!this.state.layerRemoved &&
                this.state.onCloseLayerRemoveDialog && (
                  <LayerRemoveDialog
                    open
                    project={project}
                    layersContainer={layout}
                    layerRemoved={this.state.layerRemoved}
                    onClose={this.state.onCloseLayerRemoveDialog}
                  />
                )}
              {!!this.state.editedLayer && (
                <LayerEditorDialog
                  project={project}
                  resourceManagementProps={this.props.resourceManagementProps}
                  layout={layout}
                  layer={this.state.editedLayer}
                  initialInstances={initialInstances}
                  initialTab={this.state.editedLayerInitialTab}
                  onClose={() =>
                    this.setState({
                      editedLayer: null,
                    })
                  }
                  hotReloadPreviewButtonProps={
                    this.props.hotReloadPreviewButtonProps
                  }
                />
              )}
              {this.state.scenePropertiesDialogOpen && (
                <ScenePropertiesDialog
                  open
                  project={project}
                  layout={layout}
                  onClose={() => this.openSceneProperties(false)}
                  onApply={() => this.openSceneProperties(false)}
                  onEditVariables={() => this.editLayoutVariables(true)}
                  onOpenMoreSettings={this.props.onOpenMoreSettings}
                  resourceManagementProps={this.props.resourceManagementProps}
                />
              )}
              {!!this.state.layoutVariablesDialogOpen && (
                <SceneVariablesDialog
                  open
                  project={project}
                  layout={layout}
                  onApply={() => this.editLayoutVariables(false)}
                  onClose={() => this.editLayoutVariables(false)}
                  hotReloadPreviewButtonProps={
                    this.props.hotReloadPreviewButtonProps
                  }
                />
              )}
              <I18n>
                {({ i18n }) => (
                  <React.Fragment>
                    <DismissableInfoBar
                      show={this.state.showAdditionalWorkInfoBar}
                      identifier={this.state.additionalWorkInfoBar.identifier}
                      message={i18n._(this.state.additionalWorkInfoBar.message)}
                      touchScreenMessage={i18n._(
                        this.state.additionalWorkInfoBar.touchScreenMessage
                      )}
                    />
                    <ContextMenu
                      ref={contextMenu => (this.contextMenu = contextMenu)}
                      buildMenuTemplate={(i18n, buildOptions) =>
                        this.buildContextMenu(i18n, layout, buildOptions)
                      }
                    />
                  </React.Fragment>
                )}
              </I18n>
              <InfoBar
                message={infoBarMessage}
                duration={7000}
                visible={!!infoBarMessage}
                hide={() => this.onInstanceAddedOnInvisibleLayer(null)}
              />
            </div>
          );
        }}
      </ResponsiveWindowMeasurer>
    );
  }
}
