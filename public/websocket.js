var wsUri = "ws://172.16.131.186:8069";

  function init()
  {
    testWebSocket();
  }

  function testWebSocket()
  {
    websocket = new WebSocket(wsUri);
    websocket.onopen = function(evt) { onOpen(evt) };
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };
  }

  function onOpen(evt)
  {
    console.log("websocket open");
  }

  function onClose(evt)
  {
    console.log("websocket closed");
  }

  function onMessage(evt)
  {
    piState = JSON.parse(evt.data);
    createTable(piState);
  }

  function onError(evt)
  {
    console.log("error: " + evt);
  }

  function doSend(message)
  {
    console.log("send to websocket: " + message);
    websocket.send(message);
  }

  window.addEventListener("load", init, false);
