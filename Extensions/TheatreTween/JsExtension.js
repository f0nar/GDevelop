// @flow
/**
 * This is a declaration of an extension for GDevelop 5.
 *
 * ℹ️ Changes in this file are watched and automatically imported if the editor
 * is running. You can also manually run `node import-GDJS-Runtime.js` (in newIDE/app/scripts).
 *
 * The file must be named "JsExtension.js", otherwise GDevelop won't load it.
 * ⚠️ If you make a change and the extension is not loaded, open the developer console
 * and search for any errors.
 *
 * More information on https://github.com/4ian/GDevelop/blob/master/newIDE/README-extensions.md
 */

/*::
// Import types to allow Flow to do static type checking on this file.
// Extensions declaration are typed using Flow (like the editor), but the files
// for the game engine are checked with TypeScript annotations.
import { type ObjectsRenderingService, type ObjectsEditorService } from '../JsExtensionTypes.flow.js'
*/

module.exports = {
  createExtension: function (
    _ /*: (string) => string */,
    gd /*: libGDevelop */
  ) {
    const extension = new gd.PlatformExtension();
    extension
      .setExtensionInformation(
        'Theatre Tween',
        _('Tweening'),
        _(
          'Animate object properties over time. This allows smooth transitions, animations or movement of objects to specified positions.'
        ),
        'Vladyslav Pohorielov',
        'Open source (MIT License)'
      )
      .setCategory('Visual effect')
      .setTags("tween, interpolation, smooth")
      .setExtensionHelpPath('/behaviors/tween');
    extension
      .addInstructionOrExpressionGroupMetadata(_('Tweening'))
      .setIcon('JsPlatform/Extensions/tween_behavior32.png');

    extension
      .addAction(
        'PlayTween',
        _('Tween an object'),
        _(
          "Play tween on object."
        ),
        _(
          'Play _PARAM1_ theatre sheet.'
        ),
        _('Object tween.'),
        'JsPlatform/Extensions/tween_behavior24.png',
        'JsPlatform/Extensions/tween_behavior32.png'
      )
      .addCodeOnlyParameter('currentScene', '')
      .addParameter('identifier', _('Tween Identifier'), 'sceneTween')
      // .setHidden()
      .getCodeExtraInformation()
      .addIncludeFile('Extensions/TheatreTween/tweentools.js')
      .setFunctionName('gdjs.evtTools.theatre.playTween');

    const tweenBehavior = new gd.BehaviorJsImplementation();

    console.log("initialize THEATRE JS")

    // $FlowExpectedError - ignore Flow warning as we're creating a behavior
    tweenBehavior.updateProperty = function (
      behaviorContent,
      propertyName,
      newValue
    ) {
      return false;
    };

    // $FlowExpectedError - ignore Flow warning as we're creating a behavior
    tweenBehavior.getProperties = function (behaviorContent) {
      var behaviorProperties = new gd.MapStringPropertyDescriptor();
      return behaviorProperties;
    };

    // $FlowExpectedError - ignore Flow warning as we're creating a behavior
    tweenBehavior.initializeContent = function (behaviorContent) {};

    const behavior = extension
      .addBehavior(
        'TheatreTweenBehavior',
        _('Theatre Tween'),
        'Theatre Tween',
        _(
          'Play tweens with theatre.js.'
        ),
        '',
        'JsPlatform/Extensions/tween_behavior32.png',
        'TheatreTweenBehavior',
        tweenBehavior,
        new gd.BehaviorsSharedData()
      )
      .addIncludeFile('Extensions/TheatreTween/theatretweenruntimebehavior.js');

    behavior
      .addAction(
        'PlayTween',
        _('Tween an object'),
        _('Tweens an object.'),
        _(
          'Tween the _PARAM0_ object with _PARAM2_ tween'
        ),
        _('Tween'),
        'JsPlatform/Extensions/tween_behavior24.png',
        'JsPlatform/Extensions/tween_behavior32.png'
      )
      .addParameter('object', _('Object'), '', false)
      .addParameter('behavior', _('Behavior'), 'TheatreTweenBehavior', false)
      .addParameter('identifier', _('Tween Identifier'), 'objectTween')
      .getCodeExtraInformation()
      .setFunctionName('playTween');

    // Behavior related
    // behavior
    //   .addAction(
    //     'AddObjectVariableTween',
    //     _('Add object variable tween'),
    //     _('Add a tween animation for an object variable.'),
    //     _(
    //       'Tween the variable _PARAM3_ of _PARAM0_ from _PARAM4_ to _PARAM5_ with easing _PARAM6_ over _PARAM7_ms as _PARAM2_'
    //     ),
    //     _('Variables'),
    //     'JsPlatform/Extensions/tween_behavior24.png',
    //     'JsPlatform/Extensions/tween_behavior32.png'
    //   )
    //   .addParameter('object', _('Object'), '', false)
    //   .addParameter('behavior', _('Behavior'), 'TweenBehavior', false)
    //   .addParameter('identifier', _('Tween Identifier'), 'objectTween')
    //   .addParameter('objectvar', _('Object variable'), '', false)
    //   .addParameter('expression', _('From value'), '', false)
    //   .addParameter('expression', _('To value'), '', false)
    //   .addParameter('stringWithSelector', _('Easing'), easingChoices, false)
    //   .setDefaultValue('linear')
    //   .addParameter('expression', _('Duration, in milliseconds'), '', false)
    //   .addParameter(
    //     'yesorno',
    //     _('Destroy this object when tween finishes'),
    //     '',
    //     false
    //   )
    //   .setDefaultValue('no')
    //   .setHidden()
    //   .getCodeExtraInformation()
    //   .setFunctionName('addVariableTween');

    // behavior
    //   .addAction(
    //     'AddObjectVariableTween2',
    //     _('Tween a number in an object variable'),
    //     _(
    //       "Tweens an object variable's numeric value from its current value to a new one."
    //     ),
    //     _(
    //       'Tween the variable _PARAM3_ of _PARAM0_ to _PARAM4_ with easing _PARAM5_ over _PARAM6_ms as _PARAM2_'
    //     ),
    //     _('Variables'),
    //     'JsPlatform/Extensions/tween_behavior24.png',
    //     'JsPlatform/Extensions/tween_behavior32.png'
    //   )
    //   .addParameter('object', _('Object'), '', false)
    //   .addParameter('behavior', _('Behavior'), 'TweenBehavior', false)
    //   .addParameter('identifier', _('Tween Identifier'), 'objectTween')
    //   .addParameter('objectvar', _('Object variable'), '', false)
    //   .addParameter('expression', _('To value'), '', false)
    //   .addParameter('stringWithSelector', _('Easing'), easingChoices, false)
    //   .setDefaultValue('linear')
    //   .addParameter('expression', _('Duration, in milliseconds'), '', false)
    //   .addParameter(
    //     'yesorno',
    //     _('Destroy this object when tween finishes'),
    //     '',
    //     false
    //   )
    //   .setDefaultValue('no')
    //   .getCodeExtraInformation()
    //   .setFunctionName('addVariableTween2');

    // behavior
    //   .addAction(
    //     'AddObjectPositionTween',
    //     _('Tween object position'),
    //     _('Tweens an object position from its current position to a new one.'),
    //     _(
    //       'Tween the position of _PARAM0_ to x: _PARAM3_, y: _PARAM4_ with easing _PARAM5_ over _PARAM6_ms as _PARAM2_'
    //     ),
    //     _('Position'),
    //     'JsPlatform/Extensions/tween_behavior24.png',
    //     'JsPlatform/Extensions/tween_behavior32.png'
    //   )
    //   .addParameter('object', _('Object'), '', false)
    //   .addParameter('behavior', _('Behavior'), 'TweenBehavior', false)
    //   .addParameter('identifier', _('Tween Identifier'), 'objectTween')
    //   .addParameter('expression', _('To X'), '', false)
    //   .addParameter('expression', _('To Y'), '', false)
    //   .addParameter('stringWithSelector', _('Easing'), easingChoices, false)
    //   .setDefaultValue('linear')
    //   .addParameter('expression', _('Duration, in milliseconds'), '', false)
    //   .addParameter(
    //     'yesorno',
    //     _('Destroy this object when tween finishes'),
    //     '',
    //     false
    //   )
    //   .setDefaultValue('no')
    //   .getCodeExtraInformation()
    //   .setFunctionName('addObjectPositionTween');

    // behavior
    //   .addAction(
    //     'AddObjectPositionXTween',
    //     _('Tween object X position'),
    //     _(
    //       'Tweens an object X position from its current X position to a new one.'
    //     ),
    //     _(
    //       'Tween the X position of _PARAM0_ to _PARAM3_ with easing _PARAM4_ over _PARAM5_ms as _PARAM2_'
    //     ),
    //     _('Position'),
    //     'JsPlatform/Extensions/tween_behavior24.png',
    //     'JsPlatform/Extensions/tween_behavior32.png'
    //   )
    //   .addParameter('object', _('Object'), '', false)
    //   .addParameter('behavior', _('Behavior'), 'TweenBehavior', false)
    //   .addParameter('identifier', _('Tween Identifier'), 'objectTween')
    //   .addParameter('expression', _('To X'), '', false)
    //   .addParameter('stringWithSelector', _('Easing'), easingChoices, false)
    //   .setDefaultValue('linear')
    //   .addParameter('expression', _('Duration, in milliseconds'), '', false)
    //   .addParameter(
    //     'yesorno',
    //     _('Destroy this object when tween finishes'),
    //     '',
    //     false
    //   )
    //   .setDefaultValue('no')
    //   .getCodeExtraInformation()
    //   .setFunctionName('addObjectPositionXTween');

    // behavior
    //   .addAction(
    //     'AddObjectPositionZTween',
    //     _('Tween object Z position'),
    //     _(
    //       'Tweens an object Z position (3D objects only) from its current Z position to a new one.'
    //     ),
    //     _(
    //       'Tween the Z position of _PARAM0_ to _PARAM3_ with easing _PARAM4_ over _PARAM5_ms as _PARAM2_'
    //     ),
    //     _('Position'),
    //     'JsPlatform/Extensions/tween_behavior24.png',
    //     'JsPlatform/Extensions/tween_behavior32.png'
    //   )
    //   .addParameter('object', _('Object'), '', false)
    //   .addParameter('behavior', _('Behavior'), 'TweenBehavior', false)
    //   .addParameter('identifier', _('Tween Identifier'), 'objectTween')
    //   .addParameter('expression', _('To Z'), '', false)
    //   .addParameter('stringWithSelector', _('Easing'), easingChoices, false)
    //   .setDefaultValue('linear')
    //   .addParameter('expression', _('Duration, in milliseconds'), '', false)
    //   .addParameter(
    //     'yesorno',
    //     _('Destroy this object when tween finishes'),
    //     '',
    //     false
    //   )
    //   .setDefaultValue('no')
    //   .getCodeExtraInformation()
    //   .setFunctionName('addObjectPositionZTween');

    // behavior
    //   .addAction(
    //     'AddObjectWidthTween',
    //     _('Tween object width'),
    //     _('Tweens an object width from its current width to a new one.'),
    //     _(
    //       'Tween the width of _PARAM0_ to _PARAM3_ with easing _PARAM4_ over _PARAM5_ms as _PARAM2_'
    //     ),
    //     _('Size'),
    //     'JsPlatform/Extensions/tween_behavior24.png',
    //     'JsPlatform/Extensions/tween_behavior32.png'
    //   )
    //   .addParameter('object', _('Object'), '', false)
    //   .addParameter('behavior', _('Behavior'), 'TweenBehavior', false)
    //   .addParameter('identifier', _('Tween Identifier'), 'objectTween')
    //   .addParameter('expression', _('To width'), '', false)
    //   .addParameter('stringWithSelector', _('Easing'), easingChoices, false)
    //   .setDefaultValue('linear')
    //   .addParameter('expression', _('Duration, in milliseconds'), '', false)
    //   .addParameter(
    //     'yesorno',
    //     _('Destroy this object when tween finishes'),
    //     '',
    //     false
    //   )
    //   .setDefaultValue('no')
    //   .getCodeExtraInformation()
    //   .setFunctionName('addObjectWidthTween');

    // behavior
    //   .addAction(
    //     'AddObjectHeightTween',
    //     _('Tween object height'),
    //     _('Tweens an object height from its current height to a new one.'),
    //     _(
    //       'Tween the height of _PARAM0_ to _PARAM3_ with easing _PARAM4_ over _PARAM5_ms as _PARAM2_'
    //     ),
    //     _('Size'),
    //     'JsPlatform/Extensions/tween_behavior24.png',
    //     'JsPlatform/Extensions/tween_behavior32.png'
    //   )
    //   .addParameter('object', _('Object'), '', false)
    //   .addParameter('behavior', _('Behavior'), 'TweenBehavior', false)
    //   .addParameter('identifier', _('Tween Identifier'), 'objectTween')
    //   .addParameter('expression', _('To height'), '', false)
    //   .addParameter('stringWithSelector', _('Easing'), easingChoices, false)
    //   .setDefaultValue('linear')
    //   .addParameter('expression', _('Duration, in milliseconds'), '', false)
    //   .addParameter(
    //     'yesorno',
    //     _('Destroy this object when tween finishes'),
    //     '',
    //     false
    //   )
    //   .setDefaultValue('no')
    //   .getCodeExtraInformation()
    //   .setFunctionName('addObjectHeightTween');

    // behavior
    //   .addAction(
    //     'AddObjectDepthTween',
    //     _('Tween object depth'),
    //     _(
    //       'Tweens an object depth (suitable 3D objects only) from its current depth to a new one.'
    //     ),
    //     _(
    //       'Tween the depth of _PARAM0_ to _PARAM3_ with easing _PARAM4_ over _PARAM5_ms as _PARAM2_'
    //     ),
    //     _('Size'),
    //     'JsPlatform/Extensions/tween_behavior24.png',
    //     'JsPlatform/Extensions/tween_behavior32.png'
    //   )
    //   .addParameter('object', _('Object'), '', false)
    //   .addParameter('behavior', _('Behavior'), 'TweenBehavior', false)
    //   .addParameter('identifier', _('Tween Identifier'), 'objectTween')
    //   .addParameter('expression', _('To depth'), '', false)
    //   .addParameter('stringWithSelector', _('Easing'), easingChoices, false)
    //   .setDefaultValue('linear')
    //   .addParameter('expression', _('Duration, in milliseconds'), '', false)
    //   .addParameter(
    //     'yesorno',
    //     _('Destroy this object when tween finishes'),
    //     '',
    //     false
    //   )
    //   .setDefaultValue('no')
    //   .getCodeExtraInformation()
    //   .setFunctionName('addObjectDepthTween');

    // behavior
    //   .addAction(
    //     'AddObjectPositionYTween',
    //     _('Tween object Y position'),
    //     _(
    //       'Tweens an object Y position from its current Y position to a new one.'
    //     ),
    //     _(
    //       'Tween the Y position of _PARAM0_ to _PARAM3_ with easing _PARAM4_ over _PARAM5_ms as _PARAM2_'
    //     ),
    //     _('Position'),
    //     'JsPlatform/Extensions/tween_behavior24.png',
    //     'JsPlatform/Extensions/tween_behavior32.png'
    //   )
    //   .addParameter('object', _('Object'), '', false)
    //   .addParameter('behavior', _('Behavior'), 'TweenBehavior', false)
    //   .addParameter('identifier', _('Tween Identifier'), 'objectTween')
    //   .addParameter('expression', _('To Y'), '', false)
    //   .addParameter('stringWithSelector', _('Easing'), easingChoices, false)
    //   .setDefaultValue('linear')
    //   .addParameter('expression', _('Duration, in milliseconds'), '', false)
    //   .addParameter(
    //     'yesorno',
    //     _('Destroy this object when tween finishes'),
    //     '',
    //     false
    //   )
    //   .setDefaultValue('no')
    //   .getCodeExtraInformation()
    //   .setFunctionName('addObjectPositionYTween');

    // behavior
    //   .addAction(
    //     'AddObjectScaleTween',
    //     _('Tween object scale'),
    //     _(
    //       'Tweens an object scale from its current scale to a new one (note: the scale can never be less than 0).'
    //     ),
    //     _(
    //       'Tween the scale of _PARAM0_ to X-scale: _PARAM3_, Y-scale: _PARAM4_ (from center: _PARAM8_) with easing _PARAM5_ over _PARAM6_ms as _PARAM2_'
    //     ),
    //     _('Size'),
    //     'JsPlatform/Extensions/tween_behavior24.png',
    //     'JsPlatform/Extensions/tween_behavior32.png'
    //   )
    //   .addParameter('object', _('Object'), '', false)
    //   .addParameter('behavior', _('Behavior'), 'TweenBehavior', false)
    //   .addParameter('identifier', _('Tween Identifier'), 'objectTween')
    //   .addParameter('expression', _('To scale X'), '', false)
    //   .addParameter('expression', _('To scale Y'), '', false)
    //   .addParameter('stringWithSelector', _('Easing'), easingChoices, false)
    //   .setDefaultValue('linear')
    //   .addParameter('expression', _('Duration, in milliseconds'), '', false)
    //   .addParameter(
    //     'yesorno',
    //     _('Destroy this object when tween finishes'),
    //     '',
    //     false
    //   )
    //   .setDefaultValue('no')
    //   .addParameter('yesorno', _('Scale from center of object'), '', false)
    //   .setDefaultValue('no')
    //   .getCodeExtraInformation()
    //   .setFunctionName('addObjectScaleTween');

    // behavior
    //   .addAction(
    //     'AddObjectScaleXTween',
    //     _('Tween object X-scale'),
    //     _(
    //       'Tweens an object X-scale from its current value to a new one (note: the scale can never be less than 0).'
    //     ),
    //     _(
    //       'Tween the X-scale of _PARAM0_ to _PARAM3_ (from center: _PARAM7_) with easing _PARAM4_ over _PARAM5_ms as _PARAM2_'
    //     ),
    //     _('Size'),
    //     'JsPlatform/Extensions/tween_behavior24.png',
    //     'JsPlatform/Extensions/tween_behavior32.png'
    //   )
    //   .addParameter('object', _('Object'), '', false)
    //   .addParameter('behavior', _('Behavior'), 'TweenBehavior', false)
    //   .addParameter('identifier', _('Tween Identifier'), 'objectTween')
    //   .addParameter('expression', _('To scale X'), '', false)
    //   .addParameter('stringWithSelector', _('Easing'), easingChoices, false)
    //   .setDefaultValue('linear')
    //   .addParameter('expression', _('Duration, in milliseconds'), '', false)
    //   .addParameter(
    //     'yesorno',
    //     _('Destroy this object when tween finishes'),
    //     '',
    //     false
    //   )
    //   .setDefaultValue('no')
    //   .addParameter('yesorno', _('Scale from center of object'), '', false)
    //   .setDefaultValue('no')
    //   .getCodeExtraInformation()
    //   .setFunctionName('addObjectScaleXTween');

    // behavior
    //   .addAction(
    //     'AddObjectScaleYTween',
    //     _('Tween object Y-scale'),
    //     _(
    //       'Tweens an object Y-scale from its current value to a new one (note: the scale can never be less than 0).'
    //     ),
    //     _(
    //       'Tween the Y-scale of _PARAM0_ to _PARAM3_ (from center: _PARAM7_) with easing _PARAM4_ over _PARAM5_ms as _PARAM2_'
    //     ),
    //     _('Size'),
    //     'JsPlatform/Extensions/tween_behavior24.png',
    //     'JsPlatform/Extensions/tween_behavior32.png'
    //   )
    //   .addParameter('object', _('Object'), '', false)
    //   .addParameter('behavior', _('Behavior'), 'TweenBehavior', false)
    //   .addParameter('identifier', _('Tween Identifier'), 'objectTween')
    //   .addParameter('expression', _('To scale Y'), '', false)
    //   .addParameter('stringWithSelector', _('Easing'), easingChoices, false)
    //   .setDefaultValue('linear')
    //   .addParameter('expression', _('Duration, in milliseconds'), '', false)
    //   .addParameter(
    //     'yesorno',
    //     _('Destroy this object when tween finishes'),
    //     '',
    //     false
    //   )
    //   .setDefaultValue('no')
    //   .addParameter('yesorno', _('Scale from center of object'), '', false)
    //   .setDefaultValue('no')
    //   .getCodeExtraInformation()
    //   .setFunctionName('addObjectScaleYTween');

    // behavior
    //   .addAction(
    //     'AddTextObjectCharacterSizeTween',
    //     _('Tween text size'),
    //     _(
    //       'Tweens the text object character size from its current value to a new one (note: the size can never be less than 1).'
    //     ),
    //     _(
    //       'Tween the character size of _PARAM0_ to _PARAM3_ with easing _PARAM4_ over _PARAM5_ms as _PARAM2_'
    //     ),
    //     _('Text'),
    //     'JsPlatform/Extensions/tween_behavior24.png',
    //     'JsPlatform/Extensions/tween_behavior32.png'
    //   )
    //   .addParameter('object', _('Text object'), '', false)
    //   .addParameter('behavior', _('Behavior'), 'TweenBehavior', false)
    //   .addParameter('identifier', _('Tween Identifier'), 'objectTween')
    //   .addParameter('expression', _('To character size'), '', false)
    //   .addParameter('stringWithSelector', _('Easing'), easingChoices, false)
    //   .setDefaultValue('linear')
    //   .addParameter('expression', _('Duration, in milliseconds'), '', false)
    //   .addParameter(
    //     'yesorno',
    //     _('Destroy this object when tween finishes'),
    //     '',
    //     false
    //   )
    //   .setDefaultValue('no')
    //   .getCodeExtraInformation()
    //   .setFunctionName('addTextObjectCharacterSizeTween');

    // behavior
    //   .addAction(
    //     'AddObjectOpacityTween',
    //     _('Tween object opacity'),
    //     _(
    //       'Tweens the object opacity from its current value to a new one (note: the value shall stay between 0 and 255).'
    //     ),
    //     _(
    //       'Tween the opacity of _PARAM0_ to _PARAM3_ with easing _PARAM4_ over _PARAM5_ms as _PARAM2_'
    //     ),
    //     _('Visibility'),
    //     'JsPlatform/Extensions/tween_behavior24.png',
    //     'JsPlatform/Extensions/tween_behavior32.png'
    //   )
    //   .addParameter('object', _('Object'), '', false)
    //   .addParameter('behavior', _('Behavior'), 'TweenBehavior', false)
    //   .addParameter('identifier', _('Tween Identifier'), 'objectTween')
    //   .addParameter('expression', _('To opacity'), '', false)
    //   .addParameter('stringWithSelector', _('Easing'), easingChoices, false)
    //   .setDefaultValue('linear')
    //   .addParameter('expression', _('Duration, in milliseconds'), '', false)
    //   .addParameter(
    //     'yesorno',
    //     _('Destroy this object when tween finishes'),
    //     '',
    //     false
    //   )
    //   .setDefaultValue('no')
    //   .getCodeExtraInformation()
    //   .setFunctionName('addObjectOpacityTween');

    // behavior
    //   .addAction(
    //     'AddObjectColorTween',
    //     _('Tween object color'),
    //     _(
    //       'Tweens the object color from its current value to a new one. Format: "128;200;255" with values between 0 and 255 for red, green and blue'
    //     ),
    //     _(
    //       'Tween the color of _PARAM0_ to _PARAM3_ with easing _PARAM4_ over _PARAM5_ms as _PARAM2_'
    //     ),
    //     _('Color'),
    //     'JsPlatform/Extensions/tween_behavior24.png',
    //     'JsPlatform/Extensions/tween_behavior32.png'
    //   )
    //   .addParameter('object', _('Object'), '', false)
    //   .addParameter('behavior', _('Behavior'), 'TweenBehavior', false)
    //   .addParameter('identifier', _('Tween Identifier'), 'objectTween')
    //   .addParameter('color', _('To color'), '', false)
    //   .addParameter('stringWithSelector', _('Easing'), easingChoices, false)
    //   .setDefaultValue('linear')
    //   .addParameter('expression', _('Duration, in milliseconds'), '', false)
    //   .addParameter(
    //     'yesorno',
    //     _('Destroy this object when tween finishes'),
    //     '',
    //     false
    //   )
    //   .setDefaultValue('no')
    //   .addParameter(
    //     'yesorno',
    //     _('Tween on the Hue/Saturation/Lightness (HSL)'),
    //     '',
    //     false
    //   )
    //   .setParameterLongDescription(
    //     _('Useful to have a more natural change between colors.')
    //   )
    //   .setDefaultValue('no')
    //   .getCodeExtraInformation()
    //   .setFunctionName('addObjectColorTween');

    // behavior
    //   .addAction(
    //     'AddObjectColorHSLTween',
    //     _('Tween object HSL color'),
    //     _(
    //       'Tweens the object color using Hue/Saturation/Lightness. Hue can be any number, Saturation and Lightness are between 0 and 100. Use -1 for Saturation and Lightness to let them unchanged.'
    //     ),
    //     _(
    //       'Tween the color of _PARAM0_ using HSL to H: _PARAM3_ (_PARAM4_), S: _PARAM5_, L: _PARAM6_ with easing _PARAM7_ over _PARAM8_ms as _PARAM2_'
    //     ),
    //     _('Color'),
    //     'JsPlatform/Extensions/tween_behavior24.png',
    //     'JsPlatform/Extensions/tween_behavior32.png'
    //   )
    //   .addParameter('object', _('Object'), '', false)
    //   .addParameter('behavior', _('Behavior'), 'TweenBehavior', false)
    //   .addParameter('identifier', _('Tween Identifier'), 'objectTween')
    //   .addParameter('expression', _('To Hue'), '', false)
    //   .addParameter('yesorno', _('Animate Hue'), '', false)
    //   .setDefaultValue('yes')
    //   .addParameter(
    //     'expression',
    //     _('To Saturation (0 to 100, -1 to ignore)'),
    //     '',
    //     false
    //   )
    //   .setDefaultValue('-1')
    //   .addParameter(
    //     'expression',
    //     _('To Lightness (0 to 100, -1 to ignore)'),
    //     '',
    //     false
    //   )
    //   .setDefaultValue('-1')
    //   .addParameter('stringWithSelector', _('Easing'), easingChoices, false)
    //   .setDefaultValue('linear')
    //   .addParameter('expression', _('Duration, in milliseconds'), '', false)
    //   .addParameter(
    //     'yesorno',
    //     _('Destroy this object when tween finishes'),
    //     '',
    //     false
    //   )
    //   .setDefaultValue('no')
    //   .getCodeExtraInformation()
    //   .setFunctionName('addObjectColorHSLTween');

    // behavior
    //   .addCondition(
    //     'Exists',
    //     _('Tween exists'),
    //     _('Check if the tween animation exists.'),
    //     _('Tween _PARAM2_ on _PARAM0_ exists'),
    //     '',
    //     'JsPlatform/Extensions/tween_behavior24.png',
    //     'JsPlatform/Extensions/tween_behavior32.png'
    //   )
    //   .addParameter('object', _('Object'), '', false)
    //   .addParameter('behavior', _('Behavior'), 'TweenBehavior', false)
    //   .addParameter('identifier', _('Tween Identifier'), 'objectTween')
    //   .getCodeExtraInformation()
    //   .setFunctionName('exists');

    // behavior
    //   .addCondition(
    //     'IsPlaying',
    //     _('Tween is playing'),
    //     _('Check if the tween animation is currently playing.'),
    //     _('Tween _PARAM2_ on _PARAM0_ is playing'),
    //     '',
    //     'JsPlatform/Extensions/tween_behavior24.png',
    //     'JsPlatform/Extensions/tween_behavior32.png'
    //   )
    //   .addParameter('object', _('Object'), '', false)
    //   .addParameter('behavior', _('Behavior'), 'TweenBehavior', false)
    //   .addParameter('identifier', _('Tween Identifier'), 'objectTween')
    //   .getCodeExtraInformation()
    //   .setFunctionName('isPlaying');

    // behavior
    //   .addCondition(
    //     'HasFinished',
    //     _('Tween finished playing'),
    //     _('Check if the tween animation has finished playing.'),
    //     _('Tween _PARAM2_ on _PARAM0_ has finished playing'),
    //     '',
    //     'JsPlatform/Extensions/tween_behavior24.png',
    //     'JsPlatform/Extensions/tween_behavior32.png'
    //   )
    //   .addParameter('object', _('Object'), '', false)
    //   .addParameter('behavior', _('Behavior'), 'TweenBehavior', false)
    //   .addParameter('identifier', _('Tween Identifier'), 'objectTween')
    //   .getCodeExtraInformation()
    //   .setFunctionName('hasFinished');

    // behavior
    //   .addAction(
    //     'PauseTween',
    //     _('Pause a tween'),
    //     _('Pause the running tween animation.'),
    //     _('Pause the tween _PARAM2_ on _PARAM0_'),
    //     '',
    //     'JsPlatform/Extensions/tween_behavior24.png',
    //     'JsPlatform/Extensions/tween_behavior32.png'
    //   )
    //   .addParameter('object', _('Object'), '', false)
    //   .addParameter('behavior', _('Behavior'), 'TweenBehavior', false)
    //   .addParameter('identifier', _('Tween Identifier'), 'objectTween')
    //   .getCodeExtraInformation()
    //   .setFunctionName('pauseTween');

    // behavior
    //   .addAction(
    //     'StopTween',
    //     _('Stop a tween'),
    //     _('Stop the running tween animation.'),
    //     _('Stop the tween _PARAM2_ on _PARAM0_'),
    //     '',
    //     'JsPlatform/Extensions/tween_behavior24.png',
    //     'JsPlatform/Extensions/tween_behavior32.png'
    //   )
    //   .addParameter('object', _('Object'), '', false)
    //   .addParameter('behavior', _('Behavior'), 'TweenBehavior', false)
    //   .addParameter('identifier', _('Tween Identifier'), 'objectTween')
    //   .addParameter('yesorno', _('Jump to end'), '', false)
    //   .getCodeExtraInformation()
    //   .setFunctionName('stopTween');

    // behavior
    //   .addAction(
    //     'ResumeTween',
    //     _('Resume a tween'),
    //     _('Resume the tween animation.'),
    //     _('Resume the tween _PARAM2_ on _PARAM0_'),
    //     '',
    //     'JsPlatform/Extensions/tween_behavior24.png',
    //     'JsPlatform/Extensions/tween_behavior32.png'
    //   )
    //   .addParameter('object', _('Object'), '', false)
    //   .addParameter('behavior', _('Behavior'), 'TweenBehavior', false)
    //   .addParameter('identifier', _('Tween Identifier'), 'objectTween')
    //   .getCodeExtraInformation()
    //   .setFunctionName('resumeTween');

    // behavior
    //   .addAction(
    //     'RemoveTween',
    //     _('Remove a tween'),
    //     _('Remove the tween animation from the object.'),
    //     _('Remove the tween _PARAM2_ from _PARAM0_'),
    //     '',
    //     'JsPlatform/Extensions/tween_behavior24.png',
    //     'JsPlatform/Extensions/tween_behavior32.png'
    //   )
    //   .addParameter('object', _('Object'), '', false)
    //   .addParameter('behavior', _('Behavior'), 'TweenBehavior', false)
    //   .addParameter('identifier', _('Tween Identifier'), 'objectTween')
    //   .getCodeExtraInformation()
    //   .setFunctionName('removeTween');

    // behavior
    //   .addExpression(
    //     'Progress',
    //     _('Progress of a tween'),
    //     _('Progress of a tween (between 0.0 and 1.0)'),
    //     '',
    //     'JsPlatform/Extensions/tween_behavior32.png'
    //   )
    //   .addParameter('object', _('Object'), '', false)
    //   .addParameter('behavior', _('Behavior'), 'TweenBehavior', false)
    //   .addParameter('identifier', _('Tween Identifier'), 'objectTween')
    //   .getCodeExtraInformation()
    //   .setFunctionName('getProgress');

    return extension;
  },

  runExtensionSanityTests: function (
    gd /*: libGDevelop */,
    extension /*: gdPlatformExtension*/
  ) {
    return [];
  },
};
