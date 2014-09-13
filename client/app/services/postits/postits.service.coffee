'use strict'

angular.module 'openCityApp'
.service 'postits', (Restangular) ->

  Restangular.extendModel 'postits', (model) ->
    model.vote = (type) ->
      this.customPOST({type}, "vote").then (result) =>
        _.merge this, _.pick result, ["ownVote", "score"]
    model.addComment = (comment) ->
      comment.postit = this._id
      Restangular.all("comments").post(comment)
    model.getComments = ->
      Restangular.all("comments").customGETLIST("getByPostit", {postit: this._id})

    return model;

  @search = (lat, lon, limit = 50) -> Restangular.all("postits").all("searchByLocation").getList({lat, lon, limit})

  @get = (id) -> Restangular.one("postits", id).get()

  @create = (options) -> Restangular.all("postits").post(options)

  return @
