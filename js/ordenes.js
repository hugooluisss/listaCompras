function getOrdenes(){
	$.get("vistas/ordenes.tpl", function(html){
		$(".modulo").html(html);
		
		$("#btnLlamenme").click(function(){
			auxilioSMS();
		});
		
		$.post(server + "listaOrdenesSinTerminar", {
			"movil": 1,
			"json": true,
			"cliente": idCliente
		}, function(resp){
			if (resp.length > 0){
				$.each(resp, function(i, orden){
					var el = $('<li class="list-group-item" datos=\'' + orden.json + '\'><b>' + orden.nombreServicio + '</b> <span style="color: ' + orden.color +'">(' + orden.nombreEstado + ')</span><br /><small>Solicitado el ' + orden.fecha +'</small></li>');
					$("#tplOrdenes").append(el);
					
					el.click(function(){
						$("#winDetalleOrden").attr("datos", el.attr("datos"));
						$("#winDetalleOrden").modal();
					});
				});
			}else{
				alertify.log("Por el momento no tiene ordenes pendientes");
			}
		}, "json");
		
		$("#winDetalleOrden").on("shown.bs.modal", function(e){
			var orden = jQuery.parseJSON($("#winDetalleOrden").attr("datos"));
			var mapaDetalle
			var win = $("#winDetalleOrden");
			win.find("img").prop("src", server + "repositorio/servicios/img" + orden.idServicio + ".jpg");
			
			$.each(orden, function(key, valor){
				win.find("[campo=" + key + "]").html(valor);
			});
			
			win.find("[campo=nombreEstado]").css("color", orden.color);
			
			if (orden.lat2 != null)
				win.find("#mapa").html('<iframe style="border: 0px; width: 100%;" src="https://www.google.com/maps/embed/v1/directions?key=AIzaSyAI0j32qDb3KrIzHF1ejuK9XGILtsR1AL0&origin=' + orden.lat + ',' + orden.lng + '&destination=' + orden.lat2 + ',' + orden.lng2 + '" />');
			else
				win.find("#mapa").html('<iframe style="border: 0px; width: 100%;" src="https://www.google.com/maps/embed/v1/place?key=AIzaSyAI0j32qDb3KrIzHF1ejuK9XGILtsR1AL0&q=' + orden.lat + ',' + orden.lng + '" />');
		});
		
		
		function auxilioSMS(){
			
			var success = function () { alertify.success('Listo... en un momento te devolveremos la llamada'); };
			var error = function (e) { alertify.error('No pudo enviarse el SMS'); };

			//SMS.sendSMS("9515705278", "Solicitaron ayuda desde este n�mero, m�rcale ahora... DomiApp", success, error);
			SMS.sendSMS("4498953316", "Solicitaron ayuda desde este n�mero, m�rcale ahora... DomiApp", success, error);
		}
	});
}