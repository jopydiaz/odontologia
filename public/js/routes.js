angular.module('app.routes', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  
  .state('starter', {
    url: '/starter',
    templateUrl: '/starter.html',
    controller: 'starterCrtl'
  })

 .state('login', {
    url: '/login',
    templateUrl: './login.html',
    controller: 'loginCtrl'
  })

  .state('simple', {
    url: '/simple',
    templateUrl: './simple.html',
    controller: 'pacientesCtrl'
  })

  

 $urlRouterProvider.otherwise('/login')

})
