
namespace gdjs {
  export class TheatreTweenRuntimeBehavior extends gdjs.RuntimeBehavior {
    private _runtimeScene: gdjs.RuntimeScene;

    /**
     * @param instanceContainer The instance container the behavior belongs to.
     * @param behaviorData The data to initialize the behavior
     * @param owner The runtime object the behavior belongs to.
     */
    constructor(
      instanceContainer: gdjs.RuntimeInstanceContainer,
      behaviorData: BehaviorData,
      owner: gdjs.RuntimeObject
    ) {
      super(instanceContainer, behaviorData, owner);
      this._runtimeScene = instanceContainer.getScene();
    }

    /**
     * Tween an object angle.
     * @param identifier Unique id to identify the tween
     * @param toAngle The target angle
     * @param easingValue Type of easing
     * @param durationValue Duration in milliseconds
     * @param destroyObjectWhenFinished Destroy this object when the tween ends
     */
    playTween(
      identifier: string
    ) {
      gdjs.evtTools.theatre.playTween(this._runtimeScene, identifier);
    }
  }

  gdjs.registerBehavior('TheatreTween::TheatreTweenRuntimeBehavior', gdjs.TheatreTweenRuntimeBehavior);
}
