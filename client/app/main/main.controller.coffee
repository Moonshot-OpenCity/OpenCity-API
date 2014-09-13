'use strict'

angular.module 'openCityApp'
.controller 'MainCtrl', ($scope, $http, postits, $modal) ->

  $scope.postits = []

  showPostIt = (postit) ->
    $modal.open
      templateUrl: "app/main/postit_modal.html"
      resolve:
        postit: -> postits.get postit._id
      controller: ($scope, postit) ->
        $scope.postit = postit
        $scope.vote = (type) -> postits.vote postit, type

  handlePostit = (value) ->
    value.onClick = ->
      showPostIt(value)
    value.latitude = value.location[0]
    value.longitude = value.location[1]

  loadPostits = (lat, lon, limit) ->
    postits.search(lat, lon, 50000).then (postitsLoaded) ->
      angular.forEach postitsLoaded, handlePostit
      $scope.postits = $scope.postits.concat postitsLoaded
      $scope.postits = _.uniq $scope.postits, (val) -> val._id

  loadPostits(45.75692, 4.85693)
  $scope.map =
    center:
      latitude: 45.75692,
      longitude: 4.85693
    zoom: 15
    options:
      scrollwheel: false
      streetViewControl: false
      styles: [
        featureType: "poi"
        stylers: [{ visibility: "off" }]
      ]
    clusterOptions:
      minimumClusterSize: 5
    events:
      center_changed: _.debounce (map) ->
        center = map.getCenter()
        loadPostits center.lat(), center.lng()
      , 500
      click: (map, name, mouse) ->
        # postits.create
        #   lat: mouse[0].latLng.lat()
        #   lon: mouse[0].latLng.lng()
        #   title: "Coucou c'est un test"
        #   description: "hello !"
        #   type: "positive"
        # .then (postit) ->
        #   handlePostit postit
        #   $scope.postits.push postit

