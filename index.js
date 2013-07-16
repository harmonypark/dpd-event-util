var Resource = require('deployd/lib/resource')
  , Script = require('deployd/lib/script')
  , util = require('util')
  , s = require('string')
  , validator = require('validator')
  , sanitize = validator.sanitize;

function EventResource() {
  Resource.apply(this, arguments);
}
util.inherits(EventResource, Resource);

EventResource.label = "Event-Util";
EventResource.events = ["get", "post"];

module.exports = EventResource;

EventResource.prototype.clientGeneration = true;

EventResource.prototype.handle = function (ctx, next) {
  var parts = ctx.url.split('/').filter(function(p) { return p; });

  var result = {};

  var domain = {
      url: ctx.url
    , parts: parts
    , query: ctx.query
    , body: ctx.body
    , 'this': result
    , setResult: function(val) {
      result = val;
    }
    , util : {
      string: s,
      sanitize: sanitize
    }
  };

  if (ctx.method === "POST" && this.events.post) {
    this.events.post.run(ctx, domain, function(err) {
      ctx.done(err, result);
    });
  } else if (ctx.method === "GET" && this.events.get) {
    this.events.get.run(ctx, domain, function(err) {
      ctx.done(err, result);
    });
  } else {
    next();
  }

};