namespace gdjs {
  export namespace evtTools {
    export namespace theatre {
      export const playTween = (runtimeScene: RuntimeScene, sheetIdentifier: string) => {
        const theatreStateVariable = gdjs.projectData.variables.find((variable) => variable.name === '__THEATRE_CONFIG__');

        if (!theatreStateVariable) return console.error('Theatre state variable is not found.');
        if (typeof theatreStateVariable.value !== 'string') return console.error('Theatre state variable is empty.');

        const theatreState = JSON.parse(theatreStateVariable.value);
        const project = Theatre.core.getProject(gdjs.projectData.properties.name, { state: theatreState });

        const sheetObjectsVariable = gdjs.projectData.variables.find((variable) => variable.name === sheetIdentifier);


        if (!sheetObjectsVariable || typeof sheetObjectsVariable.value !== 'string') return console.warn(`${sheetIdentifier} sheet data is not found.`);

        const sheetObjects = JSON.parse(sheetObjectsVariable.value) as Record<string, { name: string, uuid: string }>;
        // const sheetObjects = theatreState.sheetsById[sheetIdentifier].staticOverrides.byObject;
        const sheet = project.sheet(sheetIdentifier);
        const onComplete: VoidFunction[] = [];

        for (const objectName in sheetObjects) {
          // const objectData = sheetObjects[objectName];
          const tween = sheet.object(objectName, {
              position: Theatre.core.types.compound({
                x: Theatre.core.types.number(0),
                y: Theatre.core.types.number(0),
              }),
            });
          const uuid = objectName.split('(')[1].slice(0, -1);
          const name = objectName.split('(')[0].trim();
          const object = runtimeScene.getObjects(name)?.find((obj) => obj.persistentUuid === uuid);
  
          if (!object) return;

          onComplete.push(tween.onValuesChange((values) => {
            const { x, y } = values.position;
            object.setX(x);
            object.setY(y);
          }));
        }

        project.ready.then(() => {
          sheet.sequence.play().then(() => onComplete.forEach(cb => cb()));
        });
      }
    }
  }
}
