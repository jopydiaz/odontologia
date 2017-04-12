angular.module('app', ['ngRoute', 'pouchdb'])

.service('pouchdb', function(pouchDB) {

	var db = pouchDB('odontologia_test');
	return db;

})

.directive('ngRightClick', function($parse) {

  return function(scope, element, attrs) {
      var fn = $parse(attrs.ngRightClick);
      element.bind('contextmenu', function(event) {
          scope.$apply(function() {
              event.preventDefault();
              fn(scope, { $event:event });
          });
      });
      setTimeout(function() {
        angular.element('#context-menu').hide();
      }, 0)
      //script hide context menu
      if(angular.element('#context-menu').css('display', 'block')) {
        angular.element('body:not(#context-menu)').click(function() {
          angular.element('#context-menu').fadeOut()
        })
      }
    }

})

.directive('tooltip', function() {

	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			$(element).hover(function(){
				// on mouseenter
				$(element).tooltip('show');
			}, function(){
				// on mouseleave
				$(element).tooltip('hide');
			});
		}
	};

})

.factory('myAlert', function($filter) {

	return {
		showAlert(alertClass, alertTitle, alertBody) {

			var date = $filter('date')(Date.now(), 'dd/MM/yyyy HH:mm:ss');

			angular.element('#alertPlaceholder')
				.html('<div id="myAlert" class="alert '+ alertClass + '"><a class="close" data-dismiss="alert">×</a><span></span><p><strong>'+ alertTitle +'</strong></p><p>'+ alertBody +'</p><span class="small pull-right">'+ date +'</span></div>')

				setTimeout(function() {
						angular.element('#myAlert').fadeOut();
				}, 5000)

		}
	}
})

.config(function($routeProvider) {

	$routeProvider
		.when('/', {
			templateUrl: './views/main.html'
		})
		.when('/pacientes', {
			templateUrl: './views/pacientes.html',
			controller: 'pacientesCtrl'
		})
		.when('/paciente/:id', {
			templateUrl: './views/paciente.html',
			controller: 'pacientesCtrl'
		})
		.when('/ficha-medica', {
			templateUrl: './views/ficha-medica.html',
			controller: 'pacientesCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});

})

.controller('pacientesCtrl', function($scope, $location, $routeParams, pouchdb, myAlert) {

	$scope.pacientes = [];
	$scope.pacienteSelected = {};
	$scope.pacienteToEdit = {};

	if($location.path() === '/pacientes') {
		pouchdb.allDocs({ include_docs: true, attachments: true })
			.then(function(res) {
				for(var i = 0; i < res.rows.length; i++) {
					$scope.pacientes.push(res.rows[i].doc);
				}
			})
			.catch(function(err) {
				console.log(err);
			})
	} else if(typeof $routeParams.id !== 'undefined') {
		pouchdb.get($routeParams.id)
			.then(function(doc) {
				$scope.pacienteSelected = doc;
				// console.log($scope.pacienteSelected)
				readOdontograma();
			})
			.catch(function(err) {
				console.log(err)
			})
	}

	$scope.nuevoPaciente = function() {
		angular.element('#tabla-pacientes').hide()
		angular.element('#alta-pacientes').show()
	}

	$scope.cancelAltaPaciente = function() {
		angular.element('#alta-pacientes').hide()
		angular.element('#tabla-pacientes').show()
	}

	$scope.guardarPaciente = function() {
		// $scope.pacientes.push($scope.paciente)
		pouchdb.post($scope.paciente)
			.then(function(res) {
				console.log(res)
				pouchdb.get(res.id)
					.then(function(doc) {
						$scope.pacientes.push(doc)
						$scope.paciente = {};
						myAlert.showAlert('alert-success', 'Paciente creado', 'El paciente se cre&oacute; con &eacute;xito')
					})
			})
			.catch(function(err) {
				console.log(err)
				myAlert.showAlert('alert-danger', 'Ocurri&oacute; un error', 'Ocurri&oacute un error al intentar guardar el paciente')
			})
		console.log($scope.paciente)
		angular.element('#alta-pacientes').hide()
		angular.element('#tabla-pacientes').show()
	}

	$scope.eliminarPaciente = function() {
		angular.element('#modal-eliminar-paciente').modal('toggle');
	}

	$scope.confirmEliminarPaciente = function(id) {
		console.log(id)
		pouchdb.get(id)
			.then(function(doc) {
				return pouchdb.remove(doc);
			})
			.then(function(result) {
				console.log(result);
				findByAttr($scope.pacientes, '_id', result.id, function(idx) {
					console.log(idx)
					if(idx > -1) {
						$scope.pacientes.splice(idx, 1);
					}
				})
				angular.element('#modal-eliminar-paciente').modal('toggle');
				myAlert.showAlert('alert-success', 'Cambios guardados', 'El paciente se elimin&oacute; con &eacute;xito')
			})
			.catch(function(err) {
				console.log(err)
				myAlert.showAlert('alert-danger', 'Ocurri&oacute; un error', 'Ocurri&oacute un error al intentar eliminar el paciente')
			})
	}

	$scope.calculoEdad = function(fechaNac) {
		var ageDifMs = Date.now() - fechaNac.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    // $scope.paciente.edad = Math.abs(ageDate.getUTCFullYear() - 1970);
		return Math.abs(ageDate.getUTCFullYear() - 1970);
	}

	$scope.rightClick = function(e, x) {
		$scope.pacienteRightClicked = x;
    angular.element('#context-menu').fadeIn()
    angular.element('#context-menu').css('color', 'red')
    angular.element('#context-menu').css('position', 'absolute')
    angular.element('#context-menu').css('left', e.originalEvent.layerX)
    angular.element('#context-menu').css('top', e.originalEvent.layerY);
  }

	$scope.goToOdontograma = function() {
		angular.element('#editar').removeClass('active in');
		angular.element('#odontograma').addClass('active in');
	}

	$scope.goToEditar = function() {
		angular.element('#odontograma').removeClass('active in');
		angular.element('#editar').addClass('active in');
		$scope.pacienteToEdit = angular.copy($scope.pacienteSelected);
		$scope.pacienteToEdit.fechaNac = new Date($scope.pacienteSelected.fechaNac);
		$scope.pacienteToEdit.edad = $scope.calculoEdad($scope.pacienteToEdit.fechaNac);
		console.log($scope.pacienteToEdit);
	}

	$scope.saveChangesPaciente = function() {
		pouchdb.get($scope.pacienteToEdit._id)
			.then(function(doc) {
				return pouchdb.put({
					_id: doc._id,
					_rev: doc._rev,
					odontograma: doc.odontograma,
					direccion: $scope.pacienteToEdit.direccion,
					dni: $scope.pacienteToEdit.dni,
					fechaNac: $scope.pacienteToEdit.fechaNac,
					nombre: $scope.pacienteToEdit.nombre,
					nroAfiliado: $scope.pacienteToEdit.nroAfiliado,
					obraSocial: $scope.pacienteToEdit.obraSocial,
					observaciones: $scope.pacienteToEdit.observaciones,
					sexo: $scope.pacienteToEdit.sexo,
					telefono: $scope.pacienteToEdit.telefono
				});
			})
			.then(function(res) {
				console.log(res);
				pouchdb.get(res.id)
					.then(function(doc) {
						$scope.pacienteSelected = doc;
					})
				myAlert.showAlert('alert-success', 'Cambios guardados', 'La informaci&oacute;n del paciente se actualiz&oacute; con &eacute;xito')
			})
			.catch(function(err) {
				console.log(err);
				myAlert.showAlert('alert-danger', 'Ocurri&oacute; un error', 'Ocurri&oacute un error al intentar guardar la informaci&oacute;n del paciente')
			})
	}

	$scope.odontogramaResult = function() {
		var result = [];
		$('g').each(function(index) {
			if($(this).attr('id') !== 'gmain') {
				var diente = {
					id: '',
					caras: [],
					prestaciones: []
				};
				diente.id = $(this).attr('id');
				$(this).find('polygon').each(function(index, elem) {
					// if($(elem).attr('id')) {
						diente.caras.push({ id: $(this).attr('class'), fill: $(this).attr('fill') })
					// }
				})
				$(this).find('svg').each(function(index, elem) {
					switch($(elem).attr('id')) {
						case 'diente-ausente-red':
							diente.prestaciones.push('diente-ausente-red');
							break;
						case 'diente-ausente-blue':
							diente.prestaciones.push('diente-ausente-blue');
							break;
						case 'corona-red':
							diente.prestaciones.push('corona-red');
							break;
						case 'corona-blue':
							diente.prestaciones.push('corona-blue');
							break;
						case 'perno-red':
							diente.prestaciones.push('perno-red');
							break;
						case 'perno-blue':
							diente.prestaciones.push('perno-blue');
							break;
						case 'implante-red':
							diente.prestaciones.push('implante-red');
							break;
						case 'implante-blue':
							diente.prestaciones.push('implante-blue');
							break;
						case 'protesis-removible-red':
							diente.prestaciones.push('protesis-removible-red');
							break;
						case 'protesis-removible-blue':
							diente.prestaciones.push('protesis-removible-blue');
							break;
						case 'tratamiento-conducto-red':
							diente.prestaciones.push('tratamiento-conducto-red');
							break;
						case 'tratamiento-conducto-blue':
							diente.prestaciones.push('tratamiento-conducto-blue');
							break;
						case 'sellante-red':
							diente.prestaciones.push('sellante-red');
							break;
						case 'sellante-blue':
							diente.prestaciones.push('sellante-blue');
							break;
					}
					console.log($(elem).attr('id'))
					// console.log(dienteAusenteRed, elem)
				})
				result.push(diente);
			}
		})
		console.log(result)
		pouchdb.get($scope.pacienteSelected._id)
			.then(function(doc) {
				return pouchdb.put({
					_id: $scope.pacienteSelected._id,
					_rev: doc._rev,
					nombre: doc.nombre,
					dni: doc.dni,
					sexo: doc.sexo,
					fechaNac: doc.fechaNac,
					obraSocial: doc.obraSocial,
					nroAfiliado: doc.nroAfiliado,
					direccion: doc.direccion,
					telefono: doc.telefono,
					observaciones: doc.observaciones,
					odontograma: result
				});
			})
			.then(function(res) {
				console.log(res);
				myAlert.showAlert('alert-success', 'Cambios guardados', 'El odontograma se actualiz&oacute; con &eacute;xito')
			})
			.catch(function(err) {
				console.log(err);
				myAlert.showAlert('alert-danger', 'Ocurri&oacute; un error', 'Ocurri&oacute un error al intentar guardar el odontograma')
			})
	}

	function findByAttr(arr, attr, value, cb) {
		var i, arrLen = arr.length, cont = 0;
		for(i = 0; i < arrLen; i++) {
			cont++;
			if(arr[i][attr] === value) {
				return cb(i);
			} else {
				if (cont === arrLen) {
					return cb(-1);
				}
			}
		}
	}

	function readOdontograma() {
		for(var i = 0; i < $scope.pacienteSelected.odontograma.length; i++) {
			var diente = $scope.pacienteSelected.odontograma[i].id;
			for(var j = 0; j < $scope.pacienteSelected.odontograma[i].caras.length; j++) {
				var cara = $scope.pacienteSelected.odontograma[i].caras[j].id;
				var color = $scope.pacienteSelected.odontograma[i].caras[j].fill;

				angular.element('#' + diente + ' .' + cara).attr('fill', color);
				// var selector = "'#" + $scope.pacienteSelected.odontograma[i].id + " ." + $scope.pacienteSelected.odontograma[i].caras[j].id + "'";
				// $(selector).attr('fill', $scope.pacienteSelected.odontograma[i].caras[j].fill);
			}
			for(var l = 0; l < $scope.pacienteSelected.odontograma[i].prestaciones.length; l++) {
				// console.log($scope.pacienteSelected.odontograma[i].prestaciones[l])
				switch($scope.pacienteSelected.odontograma[i].prestaciones[l]) {
					case 'diente-ausente-red':
						angular.element('#' + diente).append('<svg id="diente-ausente-red"><line x1="0" y1="0" x2="20" y2="20" stroke="red" stroke-width="1"></line><line x1="20" y1="0" x2="0" y2="20" stroke="red" stroke-width="1"></line></svg>');
						break;
					case 'diente-ausente-blue':
						angular.element('#' + diente).append('<svg id="diente-ausente-blue"><line x1="0" y1="0" x2="20" y2="20" stroke="blue" stroke-width="1"></line><line x1="20" y1="0" x2="0" y2="20" stroke="blue" stroke-width="1"></line></svg>');
						break;
					case 'corona-red':
						angular.element('#' + diente).append('<svg id="corona-red"><circle cx="10" cy="10" r="10" stroke="red" stroke-width="1" fill="none"></circle></svg>');
						break;
					case 'corona-blue':
						angular.element('#' + diente).append('<svg id="corona-blue"><circle cx="10" cy="10" r="10" stroke="blue" stroke-width="1" fill="none"></circle></svg>');
						break;
					case 'perno-red':
						angular.element('#' + diente).append('<svg id="perno-red" style="overflow: visible"><line x1="10" y1="-6" x2="10" y2="10" stroke="red" stroke-width="1.7"></line></svg>');
						break;
					case 'perno-blue':
						angular.element('#' + diente).append('<svg id="perno-blue" style="overflow: visible"><line x1="10" y1="-6" x2="10" y2="10" stroke="blue" stroke-width="1.7"></line></svg>');
						break;
					case 'implante-red':
						angular.element('#' + diente).append('<svg id="implante-red" style="overflow: visible"><polygon style="transform: translate(1px, -5px) scale(0.04) " fill="red" points="320.468,38.25 320.468,0 119.656,0 119.656,38.25 177.031,38.25 177.031,103.275 148.343,114.75 148.343,124.312 177.031,112.837 177.031,141.525 148.343,153 148.343,162.562 177.031,151.087 177.031,179.775 148.343,191.25 148.343,200.812 177.031,189.337 177.031,218.025 148.343,229.5 148.343,239.062 177.031,227.588 177.031,256.275 148.343,267.75 148.343,277.312 177.031,265.838 177.031,294.525 148.343,306 148.343,315.562 177.031,304.088 177.031,332.775 148.343,344.25 148.343,353.812 177.031,342.338 177.031,396.844 221.257,440.124 263.093,396.844 263.093,307.912 291.781,296.438 291.781,286.875 263.093,298.35 263.093,269.662 291.781,258.188 291.781,248.625 263.093,260.1 263.093,231.412 291.781,219.938 291.781,210.375 263.093,221.85 263.093,193.163 291.781,181.688 291.781,172.125 263.093,183.6 263.093,154.913 291.781,143.438 291.781,133.875 263.093,145.35 263.093,116.663 291.781,105.188 291.781,95.625 263.093,107.1 263.093,78.413 291.781,66.938 291.781,57.375 263.093,68.85 263.093,38.25"/></svg>');
						break;
					case 'implante-blue':
						angular.element('#' + diente).append('<svg id="implante-blue" style="overflow: visible"><polygon style="transform: translate(1px, -5px) scale(0.04) " fill="blue" points="320.468,38.25 320.468,0 119.656,0 119.656,38.25 177.031,38.25 177.031,103.275 148.343,114.75 148.343,124.312 177.031,112.837 177.031,141.525 148.343,153 148.343,162.562 177.031,151.087 177.031,179.775 148.343,191.25 148.343,200.812 177.031,189.337 177.031,218.025 148.343,229.5 148.343,239.062 177.031,227.588 177.031,256.275 148.343,267.75 148.343,277.312 177.031,265.838 177.031,294.525 148.343,306 148.343,315.562 177.031,304.088 177.031,332.775 148.343,344.25 148.343,353.812 177.031,342.338 177.031,396.844 221.257,440.124 263.093,396.844 263.093,307.912 291.781,296.438 291.781,286.875 263.093,298.35 263.093,269.662 291.781,258.188 291.781,248.625 263.093,260.1 263.093,231.412 291.781,219.938 291.781,210.375 263.093,221.85 263.093,193.163 291.781,181.688 291.781,172.125 263.093,183.6 263.093,154.913 291.781,143.438 291.781,133.875 263.093,145.35 263.093,116.663 291.781,105.188 291.781,95.625 263.093,107.1 263.093,78.413 291.781,66.938 291.781,57.375 263.093,68.85 263.093,38.25"/></svg>');
						break;
					case 'protesis-removible-red':
						angular.element('#' + diente).append('<svg id="protesis-removible-red" style="overflow: visible"><polygon points="0,0 20,0 20,20 0,20" fill="none" stroke="red" stroke-width="1.5"></polygon></svg>');
						break;
					case 'protesis-removible-blue':
						angular.element('#' + diente).append('<svg id="protesis-removible-blue" style="overflow: visible"><polygon points="0,0 20,0 20,20 0,20" fill="none" stroke="blue" stroke-width="1.5"></polygon></svg>');
						break;
					case 'tratamiento-conducto-red':
						angular.element('#' + diente).append('<svg id="tratamiento-conducto-red"><text x="6" y="18" style="fill: red; stroke: red; stroke-width: 0.5; transform:scale(0.7)">TC</text></svg>');
						break;
					case 'tratamiento-conducto-blue':
						angular.element('#' + diente).append('<svg id="tratamiento-conducto-blue"><text x="6" y="18" style="fill: blue; stroke: blue; stroke-width: 0.5; transform:scale(0.7)">TC</text></svg>');
						break;
					case 'sellante-red':
						angular.element('#' + diente).append('<svg id="sellante-red"><text x="6" y="18" style="fill: red; stroke: red; stroke-width: 0.5; transform:scale(0.7)">Se</text></svg>');
						break;
					case 'sellante-blue':
						angular.element('#' + diente).append('<svg id="sellante-blue"><text x="6" y="18" style="fill: blue; stroke: blue; stroke-width: 0.5; transform:scale(0.7)">Se</text></svg>');
						break;
				}
			}
		}
	}

})
