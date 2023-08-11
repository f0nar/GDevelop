// @flow

import * as React from 'react';
import { action } from '@storybook/addon-actions';
import withMock from 'storybook-addon-mock';

// Keep first as it creates the `global.gd` object:
import { testProject } from '../../GDevelopJsInitializerDecorator';

import muiDecorator from '../../ThemeDecorator';
import NewBehaviorDialog from '../../../BehaviorsEditor/NewBehaviorDialog';
import { BehaviorStoreStateProvider } from '../../../AssetStore/BehaviorStore/BehaviorStoreContext';
import { GDevelopAssetApi } from '../../../Utils/GDevelopServices/ApiConfigs';
import { fakeBehaviorsRegistry } from '../../../fixtures/GDevelopServicesTestData/FakeBehaviorsRegistry';
import FixedHeightFlexContainer from '../../FixedHeightFlexContainer';
import PreferencesContext, {
  initialPreferences,
  type Preferences,
} from '../../../MainFrame/Preferences/PreferencesContext';

export default {
  title: 'ObjectEditor/NewBehaviorDialog',
  component: NewBehaviorDialog,
  decorators: [muiDecorator],
};

const apiDataServerSideError = {
  mockData: [
    {
      url: `${GDevelopAssetApi.baseUrl}/behaviors-registry`,
      method: 'GET',
      status: 500,
      response: { data: 'status' },
    },
  ],
};

const apiDataFakeBehaviors = {
  mockData: [
    {
      url: `${GDevelopAssetApi.baseUrl}/behaviors-registry`,
      method: 'GET',
      status: 200,
      response: fakeBehaviorsRegistry,
    },
  ],
};

export const DefaultForSpriteObject = () => (
  <BehaviorStoreStateProvider>
    <NewBehaviorDialog
      open
      project={testProject.project}
      objectType={'Sprite'}
      onClose={action('on close')}
      onChoose={action('on choose')}
      objectBehaviorsTypes={[
        'DestroyOutsideBehavior::DestroyOutside',
        'PlatformBehavior::PlatformBehavior',
      ]}
    />
  </BehaviorStoreStateProvider>
);
DefaultForSpriteObject.decorators = [withMock];
DefaultForSpriteObject.parameters = apiDataFakeBehaviors;

export const WithCommunityExtensions = () => {
  const [showCommunityExtensions, setShowCommunityExtensions] = React.useState(
    true
  );
  const preferences: Preferences = {
    ...initialPreferences,
    values: { ...initialPreferences.values, showCommunityExtensions },
    setShowCommunityExtensions,
  };

  return (
    <PreferencesContext.Provider value={preferences}>
      <FixedHeightFlexContainer height={400}>
        <BehaviorStoreStateProvider>
          <NewBehaviorDialog
            open
            project={testProject.project}
            objectType={'Sprite'}
            onClose={action('on close')}
            onChoose={action('on choose')}
            objectBehaviorsTypes={[
              'DestroyOutsideBehavior::DestroyOutside',
              'PlatformBehavior::PlatformBehavior',
            ]}
          />
        </BehaviorStoreStateProvider>
      </FixedHeightFlexContainer>
    </PreferencesContext.Provider>
  );
};
WithCommunityExtensions.decorators = [withMock];
WithCommunityExtensions.parameters = apiDataFakeBehaviors;

export const WithServerSideErrors = () => (
  <FixedHeightFlexContainer height={400}>
    <BehaviorStoreStateProvider>
      <NewBehaviorDialog
        open
        project={testProject.project}
        objectType={'Sprite'}
        onClose={action('on close')}
        onChoose={action('on choose')}
        objectBehaviorsTypes={[
          'DestroyOutsideBehavior::DestroyOutside',
          'PlatformBehavior::PlatformBehavior',
        ]}
      />
    </BehaviorStoreStateProvider>
  </FixedHeightFlexContainer>
);
WithServerSideErrors.decorators = [withMock];
WithServerSideErrors.parameters = apiDataServerSideError;
