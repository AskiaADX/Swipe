(function () {
  var swipe = new Swipe({
      instanceId: {%= CurrentADC.InstanceId %},
      headerFixed: {%= CurrentADC.PropValue("headerFixed") %},
      currentQuestion: '{%:= CurrentQuestion.Shortcut %}',
      isAllowDK: {%= CurrentQuestion.IsAllowDK %},
      middleAsDk: {%= CurrentADC.PropValue("middleAsDk") %}
  });
} ());
