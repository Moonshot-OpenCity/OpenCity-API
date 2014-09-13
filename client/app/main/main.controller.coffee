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
        $scope.comments = postit.getComments().$object
        $scope.vote = (type) -> postit.vote type
        $scope.sendComment = (comment) ->
          postit.addComment(comment).then (created) ->
            $scope.comments.push created
            comment.description = ""

  handlePostit = (value) ->
    value.onClick = ->
      showPostIt(value)
    value.options =
      animation: google.maps.Animation.DROP
    value.icon = if value.type == "positive" then "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=|00D900" else "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=|D90000"
    value.latitude = value.location[0]
    value.longitude = value.location[1]

  loadPostits = (lat, lon, limit) ->
    postits.search(lat, lon, 50000).then (postitsLoaded) ->
      angular.forEach postitsLoaded, handlePostit
      $scope.postits = $scope.postits.concat postitsLoaded
      $scope.postits = _.uniq $scope.postits, (val) -> val._id

  mapCenter = []

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
      # click: (map, name, mouse) ->
        # postits.create
        #   lat: mouse[0].latLng.lat()
        #   lon: mouse[0].latLng.lng()
        #   title: "Coucou c'est un test"
        #   description: "hello !"
        #   type: "negative"
        # .then (postit) ->
        #   handlePostit postit
        #   $scope.postits.push postit

  $scope.addPostit = ->
    $scope.addMarker.activated = true
    $scope.addMarker.coords = _.clone $scope.map.center

  $scope.addMarker =
    activated: false
    coords: {}
    events:
      dragend: (marker, eventName, args) ->
        $scope.$apply ->
          $scope.addMarker.coords.latitude = marker.getPosition().lat()
          $scope.addMarker.coords.longitude = marker.getPosition().lng()
    options:
      draggable: true
    icon: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=P|0000D9"

  $scope.showModalAdd = ->
    instance = $modal.open
      templateUrl: "app/main/postitadd_modal.html"
      resolve:
        coords: -> $scope.addMarker.coords
      controller: ($scope, coords, $modalInstance, postits) ->
        $scope.close = ->
          $modalInstance.dismiss 'cancel'
        $scope.postit =
          lat: coords.latitude
          lon: coords.longitude
        $scope.createPostit = (postit) ->
          postits.create(postit).then (created) ->
            $modalInstance.close created

    instance.result.then (created) ->
      handlePostit created
      $scope.postits.push created
      $scope.addMarker.activated = false

