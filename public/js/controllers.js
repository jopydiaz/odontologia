 Parse.initialize("app");
Parse.serverURL = 'http://localhost:1338/parse';






angular.module('app.controllers', [])
 

.controller('pacientesCtrl', ['$scope', 

 function($scope) {
  console.log("PAPA ACA TOY");
	$scope.pacientes = [];
	$scope.pacienteSelected = {};
	$scope.pacienteToEdit = {};
  


	


	$scope.odontogramaResult = function() {
    console.log("hola!");
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

      var Odontograma = Parse.Object.extend("Odontograma");
      var odontograma = new Odontograma();
     
      odontograma.save({
        result},{
          success: function(odontograma) {
             alert('New object created with objectId: ' + odontograma.id);
          },
          error: function(odontograma, error) {
            alert('Failed to create new object, with error code: ' + error.message);
          }
        });


		
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

}])


	
	.controller('loginCtrl', ['$scope', '$stateParams','$state',
	
	function($scope, $stateParams, $state) {
		  $scope.hola = "hola hola";
		  $scope.claves ={};

      $scope.entrar = function(){
        Parse.User.logIn( $scope.claves.myname, $scope.claves.mypass, {
          success: function(user) { 
             $state.go('starter');
            
          },
          error: function(user, error) {
             alert("Error: " + error.code + " " + error.message);
          }
        });
      }
  }])


 .controller('startCtrl', ['$scope', '$stateParams','$state',
	

	function($scope, $stateParams, $state) {
      

      var currentUser = Parse.User.current();
        if (currentUser) {
           $scope.nombre = currentUser.get("username");
           $scope.correo = currentUser.get("email");
        } else {
          $state.go('login');
      }
      
      $scope.salir = function(){

        Parse.User.logOut().then(() => {
        var currentUser = Parse.User.current();  
        });
        $state.go('login');
      }


      $scope.paciente = {};
      var date = new Date();
      $scope.ingresar = function(){
     
      var Paciente = Parse.Object.extend("Paciente");
      var paciente = new Paciente();
      

        paciente.set("nombre", $scope.paciente.name);
        paciente.set("dni", $scope.paciente.dni);
        paciente.set("sexo", $scope.paciente.sexo);
        paciente.set("nacimiento", $scope.paciente.nacimiento);
        paciente.set("osocial", $scope.paciente.osocial);
        paciente.set("telefono", $scope.paciente.telefono);
		paciente.set("direccion",$scope.paciente.direccion)
        paciente.set("Fecha", date);
        paciente.save(null, {
          success: function(paciente) {
             alert('Nuevo paciente creado: ' + paciente.id);
          },
          error: function(paciente, error) {
            alert('Failed to create new object, with error code: ' + error.message);
          }
        });
    }
 }])


.controller('tablas', ['$scope', '$stateParams','$state',
	

	function($scope, $stateParams, $state) {
  var miArray = new Array();
  var otroArray;
        var currentUser = Parse.User.current();
        if (currentUser){
            $scope.nombre = currentUser.get("username");
            $scope.correo = currentUser.get("email");
         } 
        else {
          $state.go('login');
         }
        
        $scope.salir = function(){
          Parse.User.logOut().then(() => {
          var currentUser = Parse.User.current();  // this will now be null
          });
        
          $state.go('login');
        }
        
       
        var Paciente = Parse.Object.extend("Paciente");
        var query = new Parse.Query(Paciente);
        query.find().then(function(results) {
		//	console.log(results);
        //var name = new Parse.Object(results, ["nombre"]);
		//console.log(name);
		
      });
console.log("hola");
      

    





}])

