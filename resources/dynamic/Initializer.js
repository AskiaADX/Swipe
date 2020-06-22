(function () {
  var swipe = new Swipe({
      instanceId: {%= CurrentADC.InstanceId %},
      headerFixed: {%= CurrentADC.PropValue("headerFixed") %},
      currentQuestion: '{%:= CurrentQuestion.Shortcut %}',
      middleAsDk: {%= CurrentADC.PropValue("middleAsDk") %}
  });
} ());
