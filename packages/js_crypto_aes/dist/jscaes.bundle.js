(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("crypto"));
	else if(typeof define === 'function' && define.amd)
		define(["crypto"], factory);
	else if(typeof exports === 'object')
		exports["jscaes"] = factory(require("crypto"));
	else
		root["jscaes"] = factory(root["crypto"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_crypto__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/Users/jun/ProjectJavaScript/js_crypto_aes/dist";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/asyncToGenerator.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

module.exports = _asyncToGenerator;

/***/ }),

/***/ "./node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime-module.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime-module.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() {
  return this || (typeof self === "object" && self);
})() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__(/*! ./runtime */ "./node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js");

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}


/***/ }),

/***/ "./node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() {
    return this || (typeof self === "object" && self);
  })() || Function("return this")()
);


/***/ }),

/***/ "./node_modules/@babel/runtime/regenerator/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! regenerator-runtime */ "./node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime-module.js");


/***/ }),

/***/ "./src/aes.js":
/*!********************!*\
  !*** ./src/aes.js ***!
  \********************/
/*! exports provided: encrypt, decrypt */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "encrypt", function() { return encrypt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decrypt", function() { return decrypt; });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util.js */ "./src/util.js");
/* harmony import */ var _nodeapi_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nodeapi.js */ "./src/nodeapi.js");
/* harmony import */ var _webapi_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./webapi.js */ "./src/webapi.js");
/* harmony import */ var _params_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./params.js */ "./src/params.js");
var cov_14lbry5gcg = function () {
  var path = "/Users/jun/ProjectJavaScript/js_crypto_aes/src/aes.js",
      hash = "339b604d60c86b945de397be330ceea9ef8fed81",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/Users/jun/ProjectJavaScript/js_crypto_aes/src/aes.js",
    statementMap: {
      "0": {
        start: {
          line: 17,
          column: 2
        },
        end: {
          line: 17,
          column: 92
        }
      },
      "1": {
        start: {
          line: 17,
          column: 52
        },
        end: {
          line: 17,
          column: 92
        }
      },
      "2": {
        start: {
          line: 18,
          column: 2
        },
        end: {
          line: 22,
          column: 3
        }
      },
      "3": {
        start: {
          line: 19,
          column: 4
        },
        end: {
          line: 19,
          column: 72
        }
      },
      "4": {
        start: {
          line: 19,
          column: 36
        },
        end: {
          line: 19,
          column: 72
        }
      },
      "5": {
        start: {
          line: 20,
          column: 4
        },
        end: {
          line: 20,
          column: 83
        }
      },
      "6": {
        start: {
          line: 20,
          column: 48
        },
        end: {
          line: 20,
          column: 83
        }
      },
      "7": {
        start: {
          line: 21,
          column: 4
        },
        end: {
          line: 21,
          column: 132
        }
      },
      "8": {
        start: {
          line: 21,
          column: 97
        },
        end: {
          line: 21,
          column: 132
        }
      },
      "9": {
        start: {
          line: 23,
          column: 2
        },
        end: {
          line: 26,
          column: 3
        }
      },
      "10": {
        start: {
          line: 24,
          column: 4
        },
        end: {
          line: 24,
          column: 73
        }
      },
      "11": {
        start: {
          line: 24,
          column: 37
        },
        end: {
          line: 24,
          column: 73
        }
      },
      "12": {
        start: {
          line: 25,
          column: 4
        },
        end: {
          line: 25,
          column: 76
        }
      },
      "13": {
        start: {
          line: 25,
          column: 40
        },
        end: {
          line: 25,
          column: 76
        }
      },
      "14": {
        start: {
          line: 41,
          column: 2
        },
        end: {
          line: 41,
          column: 103
        }
      },
      "15": {
        start: {
          line: 41,
          column: 67
        },
        end: {
          line: 41,
          column: 103
        }
      },
      "16": {
        start: {
          line: 42,
          column: 2
        },
        end: {
          line: 42,
          column: 42
        }
      },
      "17": {
        start: {
          line: 43,
          column: 2
        },
        end: {
          line: 43,
          column: 94
        }
      },
      "18": {
        start: {
          line: 43,
          column: 51
        },
        end: {
          line: 43,
          column: 94
        }
      },
      "19": {
        start: {
          line: 45,
          column: 20
        },
        end: {
          line: 45,
          column: 48
        }
      },
      "20": {
        start: {
          line: 46,
          column: 21
        },
        end: {
          line: 46,
          column: 47
        }
      },
      "21": {
        start: {
          line: 48,
          column: 15
        },
        end: {
          line: 48,
          column: 19
        }
      },
      "22": {
        start: {
          line: 50,
          column: 2
        },
        end: {
          line: 62,
          column: 24
        }
      },
      "23": {
        start: {
          line: 51,
          column: 4
        },
        end: {
          line: 54,
          column: 9
        }
      },
      "24": {
        start: {
          line: 53,
          column: 8
        },
        end: {
          line: 53,
          column: 23
        }
      },
      "25": {
        start: {
          line: 56,
          column: 7
        },
        end: {
          line: 62,
          column: 24
        }
      },
      "26": {
        start: {
          line: 57,
          column: 4
        },
        end: {
          line: 61,
          column: 5
        }
      },
      "27": {
        start: {
          line: 58,
          column: 6
        },
        end: {
          line: 58,
          column: 90
        }
      },
      "28": {
        start: {
          line: 60,
          column: 6
        },
        end: {
          line: 60,
          column: 21
        }
      },
      "29": {
        start: {
          line: 62,
          column: 9
        },
        end: {
          line: 62,
          column: 24
        }
      },
      "30": {
        start: {
          line: 64,
          column: 2
        },
        end: {
          line: 69,
          column: 3
        }
      },
      "31": {
        start: {
          line: 65,
          column: 4
        },
        end: {
          line: 65,
          column: 46
        }
      },
      "32": {
        start: {
          line: 71,
          column: 2
        },
        end: {
          line: 71,
          column: 14
        }
      },
      "33": {
        start: {
          line: 87,
          column: 2
        },
        end: {
          line: 87,
          column: 104
        }
      },
      "34": {
        start: {
          line: 87,
          column: 68
        },
        end: {
          line: 87,
          column: 104
        }
      },
      "35": {
        start: {
          line: 88,
          column: 2
        },
        end: {
          line: 88,
          column: 42
        }
      },
      "36": {
        start: {
          line: 89,
          column: 2
        },
        end: {
          line: 89,
          column: 94
        }
      },
      "37": {
        start: {
          line: 89,
          column: 51
        },
        end: {
          line: 89,
          column: 94
        }
      },
      "38": {
        start: {
          line: 91,
          column: 20
        },
        end: {
          line: 91,
          column: 48
        }
      },
      "39": {
        start: {
          line: 92,
          column: 21
        },
        end: {
          line: 92,
          column: 47
        }
      },
      "40": {
        start: {
          line: 94,
          column: 15
        },
        end: {
          line: 94,
          column: 19
        }
      },
      "41": {
        start: {
          line: 97,
          column: 2
        },
        end: {
          line: 110,
          column: 3
        }
      },
      "42": {
        start: {
          line: 98,
          column: 4
        },
        end: {
          line: 101,
          column: 7
        }
      },
      "43": {
        start: {
          line: 99,
          column: 6
        },
        end: {
          line: 99,
          column: 21
        }
      },
      "44": {
        start: {
          line: 100,
          column: 6
        },
        end: {
          line: 100,
          column: 25
        }
      },
      "45": {
        start: {
          line: 103,
          column: 7
        },
        end: {
          line: 110,
          column: 3
        }
      },
      "46": {
        start: {
          line: 104,
          column: 4
        },
        end: {
          line: 109,
          column: 5
        }
      },
      "47": {
        start: {
          line: 105,
          column: 6
        },
        end: {
          line: 105,
          column: 90
        }
      },
      "48": {
        start: {
          line: 107,
          column: 6
        },
        end: {
          line: 107,
          column: 21
        }
      },
      "49": {
        start: {
          line: 108,
          column: 6
        },
        end: {
          line: 108,
          column: 25
        }
      },
      "50": {
        start: {
          line: 112,
          column: 2
        },
        end: {
          line: 118,
          column: 3
        }
      },
      "51": {
        start: {
          line: 113,
          column: 4
        },
        end: {
          line: 114,
          column: 51
        }
      },
      "52": {
        start: {
          line: 113,
          column: 15
        },
        end: {
          line: 113,
          column: 39
        }
      },
      "53": {
        start: {
          line: 114,
          column: 9
        },
        end: {
          line: 114,
          column: 51
        }
      },
      "54": {
        start: {
          line: 120,
          column: 2
        },
        end: {
          line: 120,
          column: 13
        }
      }
    },
    fnMap: {
      "0": {
        name: "assertAlgorithms",
        decl: {
          start: {
            line: 16,
            column: 9
          },
          end: {
            line: 16,
            column: 25
          }
        },
        loc: {
          start: {
            line: 16,
            column: 48
          },
          end: {
            line: 27,
            column: 1
          }
        },
        line: 16
      },
      "1": {
        name: "encrypt",
        decl: {
          start: {
            line: 39,
            column: 22
          },
          end: {
            line: 39,
            column: 29
          }
        },
        loc: {
          start: {
            line: 39,
            column: 109
          },
          end: {
            line: 72,
            column: 1
          }
        },
        line: 39
      },
      "2": {
        name: "(anonymous_2)",
        decl: {
          start: {
            line: 52,
            column: 13
          },
          end: {
            line: 52,
            column: 14
          }
        },
        loc: {
          start: {
            line: 52,
            column: 19
          },
          end: {
            line: 54,
            column: 7
          }
        },
        line: 52
      },
      "3": {
        name: "decrypt",
        decl: {
          start: {
            line: 85,
            column: 22
          },
          end: {
            line: 85,
            column: 29
          }
        },
        loc: {
          start: {
            line: 85,
            column: 108
          },
          end: {
            line: 121,
            column: 1
          }
        },
        line: 85
      },
      "4": {
        name: "(anonymous_4)",
        decl: {
          start: {
            line: 98,
            column: 98
          },
          end: {
            line: 98,
            column: 99
          }
        },
        loc: {
          start: {
            line: 98,
            column: 105
          },
          end: {
            line: 101,
            column: 5
          }
        },
        line: 98
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 17,
            column: 2
          },
          end: {
            line: 17,
            column: 92
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 17,
            column: 2
          },
          end: {
            line: 17,
            column: 92
          }
        }, {
          start: {
            line: 17,
            column: 2
          },
          end: {
            line: 17,
            column: 92
          }
        }],
        line: 17
      },
      "1": {
        loc: {
          start: {
            line: 18,
            column: 2
          },
          end: {
            line: 22,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 18,
            column: 2
          },
          end: {
            line: 22,
            column: 3
          }
        }, {
          start: {
            line: 18,
            column: 2
          },
          end: {
            line: 22,
            column: 3
          }
        }],
        line: 18
      },
      "2": {
        loc: {
          start: {
            line: 19,
            column: 4
          },
          end: {
            line: 19,
            column: 72
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 19,
            column: 4
          },
          end: {
            line: 19,
            column: 72
          }
        }, {
          start: {
            line: 19,
            column: 4
          },
          end: {
            line: 19,
            column: 72
          }
        }],
        line: 19
      },
      "3": {
        loc: {
          start: {
            line: 20,
            column: 4
          },
          end: {
            line: 20,
            column: 83
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 20,
            column: 4
          },
          end: {
            line: 20,
            column: 83
          }
        }, {
          start: {
            line: 20,
            column: 4
          },
          end: {
            line: 20,
            column: 83
          }
        }],
        line: 20
      },
      "4": {
        loc: {
          start: {
            line: 20,
            column: 7
          },
          end: {
            line: 20,
            column: 46
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 20,
            column: 7
          },
          end: {
            line: 20,
            column: 24
          }
        }, {
          start: {
            line: 20,
            column: 28
          },
          end: {
            line: 20,
            column: 46
          }
        }],
        line: 20
      },
      "5": {
        loc: {
          start: {
            line: 21,
            column: 4
          },
          end: {
            line: 21,
            column: 132
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 21,
            column: 4
          },
          end: {
            line: 21,
            column: 132
          }
        }, {
          start: {
            line: 21,
            column: 4
          },
          end: {
            line: 21,
            column: 132
          }
        }],
        line: 21
      },
      "6": {
        loc: {
          start: {
            line: 21,
            column: 7
          },
          end: {
            line: 21,
            column: 95
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 21,
            column: 7
          },
          end: {
            line: 21,
            column: 42
          }
        }, {
          start: {
            line: 21,
            column: 47
          },
          end: {
            line: 21,
            column: 94
          }
        }],
        line: 21
      },
      "7": {
        loc: {
          start: {
            line: 23,
            column: 2
          },
          end: {
            line: 26,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 23,
            column: 2
          },
          end: {
            line: 26,
            column: 3
          }
        }, {
          start: {
            line: 23,
            column: 2
          },
          end: {
            line: 26,
            column: 3
          }
        }],
        line: 23
      },
      "8": {
        loc: {
          start: {
            line: 23,
            column: 5
          },
          end: {
            line: 23,
            column: 48
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 23,
            column: 5
          },
          end: {
            line: 23,
            column: 35
          }
        }, {
          start: {
            line: 23,
            column: 39
          },
          end: {
            line: 23,
            column: 48
          }
        }],
        line: 23
      },
      "9": {
        loc: {
          start: {
            line: 24,
            column: 4
          },
          end: {
            line: 24,
            column: 73
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 24,
            column: 4
          },
          end: {
            line: 24,
            column: 73
          }
        }, {
          start: {
            line: 24,
            column: 4
          },
          end: {
            line: 24,
            column: 73
          }
        }],
        line: 24
      },
      "10": {
        loc: {
          start: {
            line: 25,
            column: 4
          },
          end: {
            line: 25,
            column: 76
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 25,
            column: 4
          },
          end: {
            line: 25,
            column: 76
          }
        }, {
          start: {
            line: 25,
            column: 4
          },
          end: {
            line: 25,
            column: 76
          }
        }],
        line: 25
      },
      "11": {
        loc: {
          start: {
            line: 25,
            column: 7
          },
          end: {
            line: 25,
            column: 38
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 25,
            column: 7
          },
          end: {
            line: 25,
            column: 20
          }
        }, {
          start: {
            line: 25,
            column: 24
          },
          end: {
            line: 25,
            column: 38
          }
        }],
        line: 25
      },
      "12": {
        loc: {
          start: {
            line: 39,
            column: 41
          },
          end: {
            line: 39,
            column: 57
          }
        },
        type: "default-arg",
        locations: [{
          start: {
            line: 39,
            column: 48
          },
          end: {
            line: 39,
            column: 57
          }
        }],
        line: 39
      },
      "13": {
        loc: {
          start: {
            line: 39,
            column: 63
          },
          end: {
            line: 39,
            column: 96
          }
        },
        type: "default-arg",
        locations: [{
          start: {
            line: 39,
            column: 78
          },
          end: {
            line: 39,
            column: 96
          }
        }],
        line: 39
      },
      "14": {
        loc: {
          start: {
            line: 41,
            column: 2
          },
          end: {
            line: 41,
            column: 103
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 41,
            column: 2
          },
          end: {
            line: 41,
            column: 103
          }
        }, {
          start: {
            line: 41,
            column: 2
          },
          end: {
            line: 41,
            column: 103
          }
        }],
        line: 41
      },
      "15": {
        loc: {
          start: {
            line: 41,
            column: 5
          },
          end: {
            line: 41,
            column: 65
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 41,
            column: 5
          },
          end: {
            line: 41,
            column: 33
          }
        }, {
          start: {
            line: 41,
            column: 37
          },
          end: {
            line: 41,
            column: 65
          }
        }],
        line: 41
      },
      "16": {
        loc: {
          start: {
            line: 43,
            column: 2
          },
          end: {
            line: 43,
            column: 94
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 43,
            column: 2
          },
          end: {
            line: 43,
            column: 94
          }
        }, {
          start: {
            line: 43,
            column: 2
          },
          end: {
            line: 43,
            column: 94
          }
        }],
        line: 43
      },
      "17": {
        loc: {
          start: {
            line: 43,
            column: 5
          },
          end: {
            line: 43,
            column: 49
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 43,
            column: 5
          },
          end: {
            line: 43,
            column: 35
          }
        }, {
          start: {
            line: 43,
            column: 39
          },
          end: {
            line: 43,
            column: 49
          }
        }],
        line: 43
      },
      "18": {
        loc: {
          start: {
            line: 50,
            column: 2
          },
          end: {
            line: 62,
            column: 24
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 50,
            column: 2
          },
          end: {
            line: 62,
            column: 24
          }
        }, {
          start: {
            line: 50,
            column: 2
          },
          end: {
            line: 62,
            column: 24
          }
        }],
        line: 50
      },
      "19": {
        loc: {
          start: {
            line: 50,
            column: 6
          },
          end: {
            line: 50,
            column: 126
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 50,
            column: 6
          },
          end: {
            line: 50,
            column: 38
          }
        }, {
          start: {
            line: 50,
            column: 42
          },
          end: {
            line: 50,
            column: 83
          }
        }, {
          start: {
            line: 50,
            column: 87
          },
          end: {
            line: 50,
            column: 126
          }
        }],
        line: 50
      },
      "20": {
        loc: {
          start: {
            line: 56,
            column: 7
          },
          end: {
            line: 62,
            column: 24
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 56,
            column: 7
          },
          end: {
            line: 62,
            column: 24
          }
        }, {
          start: {
            line: 56,
            column: 7
          },
          end: {
            line: 62,
            column: 24
          }
        }],
        line: 56
      },
      "21": {
        loc: {
          start: {
            line: 64,
            column: 2
          },
          end: {
            line: 69,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 64,
            column: 2
          },
          end: {
            line: 69,
            column: 3
          }
        }, {
          start: {
            line: 64,
            column: 2
          },
          end: {
            line: 69,
            column: 3
          }
        }],
        line: 64
      },
      "22": {
        loc: {
          start: {
            line: 85,
            column: 42
          },
          end: {
            line: 85,
            column: 56
          }
        },
        type: "default-arg",
        locations: [{
          start: {
            line: 85,
            column: 47
          },
          end: {
            line: 85,
            column: 56
          }
        }],
        line: 85
      },
      "23": {
        loc: {
          start: {
            line: 85,
            column: 62
          },
          end: {
            line: 85,
            column: 95
          }
        },
        type: "default-arg",
        locations: [{
          start: {
            line: 85,
            column: 77
          },
          end: {
            line: 85,
            column: 95
          }
        }],
        line: 85
      },
      "24": {
        loc: {
          start: {
            line: 87,
            column: 2
          },
          end: {
            line: 87,
            column: 104
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 87,
            column: 2
          },
          end: {
            line: 87,
            column: 104
          }
        }, {
          start: {
            line: 87,
            column: 2
          },
          end: {
            line: 87,
            column: 104
          }
        }],
        line: 87
      },
      "25": {
        loc: {
          start: {
            line: 87,
            column: 5
          },
          end: {
            line: 87,
            column: 66
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 87,
            column: 5
          },
          end: {
            line: 87,
            column: 34
          }
        }, {
          start: {
            line: 87,
            column: 38
          },
          end: {
            line: 87,
            column: 66
          }
        }],
        line: 87
      },
      "26": {
        loc: {
          start: {
            line: 89,
            column: 2
          },
          end: {
            line: 89,
            column: 94
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 89,
            column: 2
          },
          end: {
            line: 89,
            column: 94
          }
        }, {
          start: {
            line: 89,
            column: 2
          },
          end: {
            line: 89,
            column: 94
          }
        }],
        line: 89
      },
      "27": {
        loc: {
          start: {
            line: 89,
            column: 5
          },
          end: {
            line: 89,
            column: 49
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 89,
            column: 5
          },
          end: {
            line: 89,
            column: 35
          }
        }, {
          start: {
            line: 89,
            column: 39
          },
          end: {
            line: 89,
            column: 49
          }
        }],
        line: 89
      },
      "28": {
        loc: {
          start: {
            line: 97,
            column: 2
          },
          end: {
            line: 110,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 97,
            column: 2
          },
          end: {
            line: 110,
            column: 3
          }
        }, {
          start: {
            line: 97,
            column: 2
          },
          end: {
            line: 110,
            column: 3
          }
        }],
        line: 97
      },
      "29": {
        loc: {
          start: {
            line: 97,
            column: 6
          },
          end: {
            line: 97,
            column: 126
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 97,
            column: 6
          },
          end: {
            line: 97,
            column: 38
          }
        }, {
          start: {
            line: 97,
            column: 42
          },
          end: {
            line: 97,
            column: 83
          }
        }, {
          start: {
            line: 97,
            column: 87
          },
          end: {
            line: 97,
            column: 126
          }
        }],
        line: 97
      },
      "30": {
        loc: {
          start: {
            line: 103,
            column: 7
          },
          end: {
            line: 110,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 103,
            column: 7
          },
          end: {
            line: 110,
            column: 3
          }
        }, {
          start: {
            line: 103,
            column: 7
          },
          end: {
            line: 110,
            column: 3
          }
        }],
        line: 103
      },
      "31": {
        loc: {
          start: {
            line: 112,
            column: 2
          },
          end: {
            line: 118,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 112,
            column: 2
          },
          end: {
            line: 118,
            column: 3
          }
        }, {
          start: {
            line: 112,
            column: 2
          },
          end: {
            line: 118,
            column: 3
          }
        }],
        line: 112
      },
      "32": {
        loc: {
          start: {
            line: 113,
            column: 4
          },
          end: {
            line: 114,
            column: 51
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 113,
            column: 4
          },
          end: {
            line: 114,
            column: 51
          }
        }, {
          start: {
            line: 113,
            column: 4
          },
          end: {
            line: 114,
            column: 51
          }
        }],
        line: 113
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0,
      "24": 0,
      "25": 0,
      "26": 0,
      "27": 0,
      "28": 0,
      "29": 0,
      "30": 0,
      "31": 0,
      "32": 0,
      "33": 0,
      "34": 0,
      "35": 0,
      "36": 0,
      "37": 0,
      "38": 0,
      "39": 0,
      "40": 0,
      "41": 0,
      "42": 0,
      "43": 0,
      "44": 0,
      "45": 0,
      "46": 0,
      "47": 0,
      "48": 0,
      "49": 0,
      "50": 0,
      "51": 0,
      "52": 0,
      "53": 0,
      "54": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0],
      "3": [0, 0],
      "4": [0, 0],
      "5": [0, 0],
      "6": [0, 0],
      "7": [0, 0],
      "8": [0, 0],
      "9": [0, 0],
      "10": [0, 0],
      "11": [0, 0],
      "12": [0],
      "13": [0],
      "14": [0, 0],
      "15": [0, 0],
      "16": [0, 0],
      "17": [0, 0],
      "18": [0, 0],
      "19": [0, 0, 0],
      "20": [0, 0],
      "21": [0, 0],
      "22": [0],
      "23": [0],
      "24": [0, 0],
      "25": [0, 0],
      "26": [0, 0],
      "27": [0, 0],
      "28": [0, 0],
      "29": [0, 0, 0],
      "30": [0, 0],
      "31": [0, 0],
      "32": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();




/**
 * aes.js
 */




/**
 * Check if the given algorithm spec is valid.
 * @param name
 * @param iv
 * @param tagLength
 */

function assertAlgorithms(_ref) {
  var name = _ref.name,
      iv = _ref.iv,
      tagLength = _ref.tagLength;
  cov_14lbry5gcg.f[0]++;
  cov_14lbry5gcg.s[0]++;

  if (Object.keys(_params_js__WEBPACK_IMPORTED_MODULE_5__["default"].ciphers).indexOf(name) < 0) {
    cov_14lbry5gcg.b[0][0]++;
    cov_14lbry5gcg.s[1]++;
    throw new Error('UnsupportedAlgorithm');
  } else {
    cov_14lbry5gcg.b[0][1]++;
  }

  cov_14lbry5gcg.s[2]++;

  if (_params_js__WEBPACK_IMPORTED_MODULE_5__["default"].ciphers[name].ivLength) {
    cov_14lbry5gcg.b[1][0]++;
    cov_14lbry5gcg.s[3]++;

    if (!(iv instanceof Uint8Array)) {
      cov_14lbry5gcg.b[2][0]++;
      cov_14lbry5gcg.s[4]++;
      throw new Error('InvalidArguments');
    } else {
      cov_14lbry5gcg.b[2][1]++;
    }

    cov_14lbry5gcg.s[5]++;

    if ((cov_14lbry5gcg.b[4][0]++, iv.byteLength < 2) || (cov_14lbry5gcg.b[4][1]++, iv.byteLength > 16)) {
      cov_14lbry5gcg.b[3][0]++;
      cov_14lbry5gcg.s[6]++;
      throw new Error('InvalidIVLength');
    } else {
      cov_14lbry5gcg.b[3][1]++;
    }

    cov_14lbry5gcg.s[7]++;

    if ((cov_14lbry5gcg.b[6][0]++, _params_js__WEBPACK_IMPORTED_MODULE_5__["default"].ciphers[name].staticIvLength) && (cov_14lbry5gcg.b[6][1]++, _params_js__WEBPACK_IMPORTED_MODULE_5__["default"].ciphers[name].ivLength !== iv.byteLength)) {
      cov_14lbry5gcg.b[5][0]++;
      cov_14lbry5gcg.s[8]++;
      throw new Error('InvalidIVLength');
    } else {
      cov_14lbry5gcg.b[5][1]++;
    }
  } else {
    cov_14lbry5gcg.b[1][1]++;
  }

  cov_14lbry5gcg.s[9]++;

  if ((cov_14lbry5gcg.b[8][0]++, _params_js__WEBPACK_IMPORTED_MODULE_5__["default"].ciphers[name].tagLength) && (cov_14lbry5gcg.b[8][1]++, tagLength)) {
    cov_14lbry5gcg.b[7][0]++;
    cov_14lbry5gcg.s[10]++;

    if (!Number.isInteger(tagLength)) {
      cov_14lbry5gcg.b[9][0]++;
      cov_14lbry5gcg.s[11]++;
      throw new Error('InvalidArguments');
    } else {
      cov_14lbry5gcg.b[9][1]++;
    }

    cov_14lbry5gcg.s[12]++;

    if ((cov_14lbry5gcg.b[11][0]++, tagLength < 4) || (cov_14lbry5gcg.b[11][1]++, tagLength > 16)) {
      cov_14lbry5gcg.b[10][0]++;
      cov_14lbry5gcg.s[13]++;
      throw new Error('InvalidTagLength');
    } else {
      cov_14lbry5gcg.b[10][1]++;
    }
  } else {
    cov_14lbry5gcg.b[7][1]++;
  }
}
/**
 * Encrypt with AES
 * @param msg
 * @param key
 * @param name
 * @param iv
 * @param additionalData
 * @param tagLength
 * @return {Promise<Uint8Array>}
 */


function encrypt(_x, _x2, _x3) {
  return _encrypt.apply(this, arguments);
}
/**
 * Decrypt with AES
 * @param data
 * @param key
 * @param name
 * @param iv
 * @param additionalData
 * @param tagLength
 * @return {Promise<Uint8Array>}
 */

function _encrypt() {
  _encrypt = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()(
  /*#__PURE__*/
  _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(msg, key, _ref2) {
    var _ref2$name, name, iv, _ref2$additionalData, additionalData, tagLength, webCrypto, nodeCrypto, native, data;

    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _ref2$name = _ref2.name, name = _ref2$name === void 0 ? (cov_14lbry5gcg.b[12][0]++, 'AES-GCM') : _ref2$name, iv = _ref2.iv, _ref2$additionalData = _ref2.additionalData, additionalData = _ref2$additionalData === void 0 ? (cov_14lbry5gcg.b[13][0]++, new Uint8Array([])) : _ref2$additionalData, tagLength = _ref2.tagLength;
            cov_14lbry5gcg.f[1]++;
            cov_14lbry5gcg.s[14]++;

            if (!((cov_14lbry5gcg.b[15][0]++, !(msg instanceof Uint8Array)) || (cov_14lbry5gcg.b[15][1]++, !(key instanceof Uint8Array)))) {
              _context.next = 9;
              break;
            }

            cov_14lbry5gcg.b[14][0]++;
            cov_14lbry5gcg.s[15]++;
            throw new Error('InvalidArguments');

          case 9:
            cov_14lbry5gcg.b[14][1]++;

          case 10:
            cov_14lbry5gcg.s[16]++;
            assertAlgorithms({
              name: name,
              iv: iv,
              tagLength: tagLength
            });
            cov_14lbry5gcg.s[17]++;

            if ((cov_14lbry5gcg.b[17][0]++, _params_js__WEBPACK_IMPORTED_MODULE_5__["default"].ciphers[name].tagLength) && (cov_14lbry5gcg.b[17][1]++, !tagLength)) {
              cov_14lbry5gcg.b[16][0]++;
              cov_14lbry5gcg.s[18]++;
              tagLength = _params_js__WEBPACK_IMPORTED_MODULE_5__["default"].ciphers[name].tagLength;
            } else {
              cov_14lbry5gcg.b[16][1]++;
            }

            cov_14lbry5gcg.s[19]++;
            _context.next = 17;
            return _util_js__WEBPACK_IMPORTED_MODULE_2__["getWebCryptoAll"]();

          case 17:
            webCrypto = _context.sent;
            cov_14lbry5gcg.s[20]++;
            _context.next = 21;
            return _util_js__WEBPACK_IMPORTED_MODULE_2__["getNodeCrypto"]();

          case 21:
            nodeCrypto = _context.sent;
            // node crypto
            native = (cov_14lbry5gcg.s[21]++, true);
            cov_14lbry5gcg.s[22]++;

            if (!((cov_14lbry5gcg.b[19][0]++, typeof webCrypto !== 'undefined') && (cov_14lbry5gcg.b[19][1]++, typeof webCrypto.importKey === 'function') && (cov_14lbry5gcg.b[19][2]++, typeof webCrypto.encrypt === 'function'))) {
              _context.next = 32;
              break;
            }

            cov_14lbry5gcg.b[18][0]++;
            cov_14lbry5gcg.s[23]++;
            _context.next = 29;
            return _webapi_js__WEBPACK_IMPORTED_MODULE_4__["encrypt"](msg, key, {
              name: name,
              iv: iv,
              additionalData: additionalData,
              tagLength: tagLength
            }, webCrypto).catch(function () {
              cov_14lbry5gcg.f[2]++;
              cov_14lbry5gcg.s[24]++;
              native = false;
            });

          case 29:
            data = _context.sent;
            _context.next = 35;
            break;

          case 32:
            cov_14lbry5gcg.b[18][1]++;
            cov_14lbry5gcg.s[25]++;

            if (typeof nodeCrypto !== 'undefined') {
              cov_14lbry5gcg.b[20][0]++;
              cov_14lbry5gcg.s[26]++;

              // for node
              try {
                cov_14lbry5gcg.s[27]++;
                data = _nodeapi_js__WEBPACK_IMPORTED_MODULE_3__["encrypt"](msg, key, {
                  name: name,
                  iv: iv,
                  additionalData: additionalData,
                  tagLength: tagLength
                }, nodeCrypto);
              } catch (e) {
                cov_14lbry5gcg.s[28]++;
                native = false;
              }
            } else {
              cov_14lbry5gcg.b[20][1]++;
              cov_14lbry5gcg.s[29]++;
              native = false;
            }

          case 35:
            cov_14lbry5gcg.s[30]++;

            if (!(native === false)) {
              _context.next = 42;
              break;
            }

            cov_14lbry5gcg.b[21][0]++;
            cov_14lbry5gcg.s[31]++;
            throw new Error('UnsupportedEnvironment');

          case 42:
            cov_14lbry5gcg.b[21][1]++;

          case 43:
            cov_14lbry5gcg.s[32]++;
            return _context.abrupt("return", data);

          case 45:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _encrypt.apply(this, arguments);
}

function decrypt(_x4, _x5, _x6) {
  return _decrypt.apply(this, arguments);
}

function _decrypt() {
  _decrypt = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()(
  /*#__PURE__*/
  _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(data, key, _ref3) {
    var _ref3$name, name, iv, _ref3$additionalData, additionalData, tagLength, webCrypto, nodeCrypto, native, errMsg, msg;

    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _ref3$name = _ref3.name, name = _ref3$name === void 0 ? (cov_14lbry5gcg.b[22][0]++, 'AES-GCM') : _ref3$name, iv = _ref3.iv, _ref3$additionalData = _ref3.additionalData, additionalData = _ref3$additionalData === void 0 ? (cov_14lbry5gcg.b[23][0]++, new Uint8Array([])) : _ref3$additionalData, tagLength = _ref3.tagLength;
            cov_14lbry5gcg.f[3]++;
            cov_14lbry5gcg.s[33]++;

            if (!((cov_14lbry5gcg.b[25][0]++, !(data instanceof Uint8Array)) || (cov_14lbry5gcg.b[25][1]++, !(key instanceof Uint8Array)))) {
              _context2.next = 9;
              break;
            }

            cov_14lbry5gcg.b[24][0]++;
            cov_14lbry5gcg.s[34]++;
            throw new Error('InvalidArguments');

          case 9:
            cov_14lbry5gcg.b[24][1]++;

          case 10:
            cov_14lbry5gcg.s[35]++;
            assertAlgorithms({
              name: name,
              iv: iv,
              tagLength: tagLength
            });
            cov_14lbry5gcg.s[36]++;

            if ((cov_14lbry5gcg.b[27][0]++, _params_js__WEBPACK_IMPORTED_MODULE_5__["default"].ciphers[name].tagLength) && (cov_14lbry5gcg.b[27][1]++, !tagLength)) {
              cov_14lbry5gcg.b[26][0]++;
              cov_14lbry5gcg.s[37]++;
              tagLength = _params_js__WEBPACK_IMPORTED_MODULE_5__["default"].ciphers[name].tagLength;
            } else {
              cov_14lbry5gcg.b[26][1]++;
            }

            cov_14lbry5gcg.s[38]++;
            _context2.next = 17;
            return _util_js__WEBPACK_IMPORTED_MODULE_2__["getWebCryptoAll"]();

          case 17:
            webCrypto = _context2.sent;
            cov_14lbry5gcg.s[39]++;
            _context2.next = 21;
            return _util_js__WEBPACK_IMPORTED_MODULE_2__["getNodeCrypto"]();

          case 21:
            nodeCrypto = _context2.sent;
            // node crypto
            native = (cov_14lbry5gcg.s[40]++, true);
            cov_14lbry5gcg.s[41]++;

            if (!((cov_14lbry5gcg.b[29][0]++, typeof webCrypto !== 'undefined') && (cov_14lbry5gcg.b[29][1]++, typeof webCrypto.importKey === 'function') && (cov_14lbry5gcg.b[29][2]++, typeof webCrypto.encrypt === 'function'))) {
              _context2.next = 32;
              break;
            }

            cov_14lbry5gcg.b[28][0]++;
            cov_14lbry5gcg.s[42]++;
            _context2.next = 29;
            return _webapi_js__WEBPACK_IMPORTED_MODULE_4__["decrypt"](data, key, {
              name: name,
              iv: iv,
              additionalData: additionalData,
              tagLength: tagLength
            }, webCrypto).catch(function (e) {
              cov_14lbry5gcg.f[4]++;
              cov_14lbry5gcg.s[43]++;
              native = false;
              cov_14lbry5gcg.s[44]++;
              errMsg = e.message;
            });

          case 29:
            msg = _context2.sent;
            _context2.next = 35;
            break;

          case 32:
            cov_14lbry5gcg.b[28][1]++;
            cov_14lbry5gcg.s[45]++;

            if (typeof nodeCrypto !== 'undefined') {
              cov_14lbry5gcg.b[30][0]++;
              cov_14lbry5gcg.s[46]++;

              try {
                cov_14lbry5gcg.s[47]++;
                msg = _nodeapi_js__WEBPACK_IMPORTED_MODULE_3__["decrypt"](data, key, {
                  name: name,
                  iv: iv,
                  additionalData: additionalData,
                  tagLength: tagLength
                }, nodeCrypto);
              } catch (e) {
                cov_14lbry5gcg.s[48]++;
                native = false;
                cov_14lbry5gcg.s[49]++;
                errMsg = e.message;
              }
            } else {
              cov_14lbry5gcg.b[30][1]++;
            }

          case 35:
            cov_14lbry5gcg.s[50]++;

            if (!(native === false)) {
              _context2.next = 50;
              break;
            }

            cov_14lbry5gcg.b[31][0]++;
            cov_14lbry5gcg.s[51]++;

            if (!errMsg) {
              _context2.next = 45;
              break;
            }

            cov_14lbry5gcg.b[32][0]++;
            cov_14lbry5gcg.s[52]++;
            throw new Error(errMsg);

          case 45:
            cov_14lbry5gcg.b[32][1]++;
            cov_14lbry5gcg.s[53]++;
            throw new Error('UnsupportedEnvironment');

          case 48:
            _context2.next = 51;
            break;

          case 50:
            cov_14lbry5gcg.b[31][1]++;

          case 51:
            cov_14lbry5gcg.s[54]++;
            return _context2.abrupt("return", msg);

          case 53:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _decrypt.apply(this, arguments);
}

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: default, encrypt, decrypt */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _aes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./aes.js */ "./src/aes.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "encrypt", function() { return _aes_js__WEBPACK_IMPORTED_MODULE_0__["encrypt"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "decrypt", function() { return _aes_js__WEBPACK_IMPORTED_MODULE_0__["decrypt"]; });

var cov_9a6i30e4h = function () {
  var path = "/Users/jun/ProjectJavaScript/js_crypto_aes/src/index.js",
      hash = "7e0fb52467d7d2b2a27dca8231f434a16def210d",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/Users/jun/ProjectJavaScript/js_crypto_aes/src/index.js",
    statementMap: {},
    fnMap: {},
    branchMap: {},
    s: {},
    f: {},
    b: {},
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

/**
 * index.js
 */

/* harmony default export */ __webpack_exports__["default"] = ({
  encrypt: _aes_js__WEBPACK_IMPORTED_MODULE_0__["encrypt"],
  decrypt: _aes_js__WEBPACK_IMPORTED_MODULE_0__["decrypt"]
});


/***/ }),

/***/ "./src/nodeapi.js":
/*!************************!*\
  !*** ./src/nodeapi.js ***!
  \************************/
/*! exports provided: encrypt, decrypt */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "encrypt", function() { return encrypt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decrypt", function() { return decrypt; });
/* harmony import */ var _params_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./params.js */ "./src/params.js");
var cov_29o9z2kkvr = function () {
  var path = "/Users/jun/ProjectJavaScript/js_crypto_aes/src/nodeapi.js",
      hash = "d4082e7a2f27301b532ef061b052b8c55bb30fd5",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/Users/jun/ProjectJavaScript/js_crypto_aes/src/nodeapi.js",
    statementMap: {
      "0": {
        start: {
          line: 8,
          column: 12
        },
        end: {
          line: 8,
          column: 43
        }
      },
      "1": {
        start: {
          line: 9,
          column: 2
        },
        end: {
          line: 9,
          column: 51
        }
      },
      "2": {
        start: {
          line: 10,
          column: 2
        },
        end: {
          line: 10,
          column: 46
        }
      },
      "3": {
        start: {
          line: 13,
          column: 2
        },
        end: {
          line: 24,
          column: 3
        }
      },
      "4": {
        start: {
          line: 15,
          column: 4
        },
        end: {
          line: 15,
          column: 81
        }
      },
      "5": {
        start: {
          line: 16,
          column: 4
        },
        end: {
          line: 16,
          column: 34
        }
      },
      "6": {
        start: {
          line: 17,
          column: 4
        },
        end: {
          line: 17,
          column: 10
        }
      },
      "7": {
        start: {
          line: 20,
          column: 4
        },
        end: {
          line: 20,
          column: 53
        }
      },
      "8": {
        start: {
          line: 21,
          column: 4
        },
        end: {
          line: 21,
          column: 10
        }
      },
      "9": {
        start: {
          line: 23,
          column: 11
        },
        end: {
          line: 23,
          column: 48
        }
      },
      "10": {
        start: {
          line: 26,
          column: 15
        },
        end: {
          line: 26,
          column: 49
        }
      },
      "11": {
        start: {
          line: 27,
          column: 16
        },
        end: {
          line: 27,
          column: 46
        }
      },
      "12": {
        start: {
          line: 29,
          column: 12
        },
        end: {
          line: 29,
          column: 30
        }
      },
      "13": {
        start: {
          line: 30,
          column: 2
        },
        end: {
          line: 30,
          column: 67
        }
      },
      "14": {
        start: {
          line: 30,
          column: 25
        },
        end: {
          line: 30,
          column: 67
        }
      },
      "15": {
        start: {
          line: 32,
          column: 15
        },
        end: {
          line: 32,
          column: 70
        }
      },
      "16": {
        start: {
          line: 33,
          column: 2
        },
        end: {
          line: 33,
          column: 17
        }
      },
      "17": {
        start: {
          line: 34,
          column: 2
        },
        end: {
          line: 34,
          column: 31
        }
      },
      "18": {
        start: {
          line: 35,
          column: 2
        },
        end: {
          line: 35,
          column: 44
        }
      },
      "19": {
        start: {
          line: 37,
          column: 2
        },
        end: {
          line: 37,
          column: 14
        }
      },
      "20": {
        start: {
          line: 42,
          column: 12
        },
        end: {
          line: 42,
          column: 43
        }
      },
      "21": {
        start: {
          line: 43,
          column: 2
        },
        end: {
          line: 43,
          column: 51
        }
      },
      "22": {
        start: {
          line: 44,
          column: 2
        },
        end: {
          line: 44,
          column: 46
        }
      },
      "23": {
        start: {
          line: 48,
          column: 2
        },
        end: {
          line: 63,
          column: 3
        }
      },
      "24": {
        start: {
          line: 50,
          column: 4
        },
        end: {
          line: 50,
          column: 85
        }
      },
      "25": {
        start: {
          line: 51,
          column: 4
        },
        end: {
          line: 51,
          column: 36
        }
      },
      "26": {
        start: {
          line: 52,
          column: 4
        },
        end: {
          line: 52,
          column: 50
        }
      },
      "27": {
        start: {
          line: 53,
          column: 16
        },
        end: {
          line: 53,
          column: 51
        }
      },
      "28": {
        start: {
          line: 54,
          column: 4
        },
        end: {
          line: 54,
          column: 29
        }
      },
      "29": {
        start: {
          line: 55,
          column: 4
        },
        end: {
          line: 55,
          column: 10
        }
      },
      "30": {
        start: {
          line: 58,
          column: 4
        },
        end: {
          line: 58,
          column: 57
        }
      },
      "31": {
        start: {
          line: 59,
          column: 4
        },
        end: {
          line: 59,
          column: 16
        }
      },
      "32": {
        start: {
          line: 60,
          column: 4
        },
        end: {
          line: 60,
          column: 10
        }
      },
      "33": {
        start: {
          line: 62,
          column: 11
        },
        end: {
          line: 62,
          column: 48
        }
      },
      "34": {
        start: {
          line: 65,
          column: 24
        },
        end: {
          line: 65,
          column: 45
        }
      },
      "35": {
        start: {
          line: 67,
          column: 2
        },
        end: {
          line: 71,
          column: 3
        }
      },
      "36": {
        start: {
          line: 68,
          column: 4
        },
        end: {
          line: 68,
          column: 29
        }
      },
      "37": {
        start: {
          line: 70,
          column: 4
        },
        end: {
          line: 70,
          column: 41
        }
      },
      "38": {
        start: {
          line: 72,
          column: 14
        },
        end: {
          line: 72,
          column: 65
        }
      },
      "39": {
        start: {
          line: 73,
          column: 2
        },
        end: {
          line: 73,
          column: 25
        }
      },
      "40": {
        start: {
          line: 74,
          column: 2
        },
        end: {
          line: 74,
          column: 39
        }
      },
      "41": {
        start: {
          line: 76,
          column: 2
        },
        end: {
          line: 76,
          column: 13
        }
      }
    },
    fnMap: {
      "0": {
        name: "encrypt",
        decl: {
          start: {
            line: 7,
            column: 16
          },
          end: {
            line: 7,
            column: 23
          }
        },
        loc: {
          start: {
            line: 7,
            column: 96
          },
          end: {
            line: 38,
            column: 1
          }
        },
        line: 7
      },
      "1": {
        name: "decrypt",
        decl: {
          start: {
            line: 41,
            column: 16
          },
          end: {
            line: 41,
            column: 23
          }
        },
        loc: {
          start: {
            line: 41,
            column: 96
          },
          end: {
            line: 77,
            column: 1
          }
        },
        line: 41
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 7,
            column: 35
          },
          end: {
            line: 7,
            column: 51
          }
        },
        type: "default-arg",
        locations: [{
          start: {
            line: 7,
            column: 42
          },
          end: {
            line: 7,
            column: 51
          }
        }],
        line: 7
      },
      "1": {
        loc: {
          start: {
            line: 13,
            column: 2
          },
          end: {
            line: 24,
            column: 3
          }
        },
        type: "switch",
        locations: [{
          start: {
            line: 14,
            column: 2
          },
          end: {
            line: 18,
            column: 3
          }
        }, {
          start: {
            line: 19,
            column: 2
          },
          end: {
            line: 22,
            column: 3
          }
        }, {
          start: {
            line: 23,
            column: 2
          },
          end: {
            line: 23,
            column: 48
          }
        }],
        line: 13
      },
      "2": {
        loc: {
          start: {
            line: 30,
            column: 2
          },
          end: {
            line: 30,
            column: 67
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 30,
            column: 2
          },
          end: {
            line: 30,
            column: 67
          }
        }, {
          start: {
            line: 30,
            column: 2
          },
          end: {
            line: 30,
            column: 67
          }
        }],
        line: 30
      },
      "3": {
        loc: {
          start: {
            line: 41,
            column: 36
          },
          end: {
            line: 41,
            column: 50
          }
        },
        type: "default-arg",
        locations: [{
          start: {
            line: 41,
            column: 41
          },
          end: {
            line: 41,
            column: 50
          }
        }],
        line: 41
      },
      "4": {
        loc: {
          start: {
            line: 48,
            column: 2
          },
          end: {
            line: 63,
            column: 3
          }
        },
        type: "switch",
        locations: [{
          start: {
            line: 49,
            column: 2
          },
          end: {
            line: 56,
            column: 3
          }
        }, {
          start: {
            line: 57,
            column: 2
          },
          end: {
            line: 61,
            column: 3
          }
        }, {
          start: {
            line: 62,
            column: 2
          },
          end: {
            line: 62,
            column: 48
          }
        }],
        line: 48
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0,
      "24": 0,
      "25": 0,
      "26": 0,
      "27": 0,
      "28": 0,
      "29": 0,
      "30": 0,
      "31": 0,
      "32": 0,
      "33": 0,
      "34": 0,
      "35": 0,
      "36": 0,
      "37": 0,
      "38": 0,
      "39": 0,
      "40": 0,
      "41": 0
    },
    f: {
      "0": 0,
      "1": 0
    },
    b: {
      "0": [0],
      "1": [0, 0, 0],
      "2": [0, 0],
      "3": [0],
      "4": [0, 0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

/**
 * nodeapi.js
 */

function encrypt(msg, key, _ref, nodeCrypto) {
  var _ref$name = _ref.name,
      name = _ref$name === void 0 ? (cov_29o9z2kkvr.b[0][0]++, 'AES-GCM') : _ref$name,
      iv = _ref.iv,
      additionalData = _ref.additionalData,
      tagLength = _ref.tagLength;
  cov_29o9z2kkvr.f[0]++;
  var alg = (cov_29o9z2kkvr.s[0]++, _params_js__WEBPACK_IMPORTED_MODULE_0__["default"].ciphers[name].nodePrefix);
  cov_29o9z2kkvr.s[1]++;
  alg = "".concat(alg, "-").concat((key.byteLength * 8).toString(), "-");
  cov_29o9z2kkvr.s[2]++;
  alg = alg + _params_js__WEBPACK_IMPORTED_MODULE_0__["default"].ciphers[name].nodeSuffix;
  var cipher;
  cov_29o9z2kkvr.s[3]++;

  switch (name) {
    case 'AES-GCM':
      cov_29o9z2kkvr.b[1][0]++;
      {
        cov_29o9z2kkvr.s[4]++;
        cipher = nodeCrypto.createCipheriv(alg, key, iv, {
          authTagLength: tagLength
        });
        cov_29o9z2kkvr.s[5]++;
        cipher.setAAD(additionalData);
        cov_29o9z2kkvr.s[6]++;
        break;
      }

    case 'AES-CBC':
      cov_29o9z2kkvr.b[1][1]++;
      {
        cov_29o9z2kkvr.s[7]++;
        cipher = nodeCrypto.createCipheriv(alg, key, iv);
        cov_29o9z2kkvr.s[8]++;
        break;
      }

    default:
      cov_29o9z2kkvr.b[1][2]++;
      cov_29o9z2kkvr.s[9]++;
      throw new Error('UnsupportedCipher');
  }

  var body = (cov_29o9z2kkvr.s[10]++, new Uint8Array(cipher.update(msg)));
  var final = (cov_29o9z2kkvr.s[11]++, new Uint8Array(cipher.final()));
  var tag = (cov_29o9z2kkvr.s[12]++, new Uint8Array([]));
  cov_29o9z2kkvr.s[13]++;

  if (name === 'AES-GCM') {
    cov_29o9z2kkvr.b[2][0]++;
    cov_29o9z2kkvr.s[14]++;
    tag = new Uint8Array(cipher.getAuthTag());
  } else {
    cov_29o9z2kkvr.b[2][1]++;
  }

  var data = (cov_29o9z2kkvr.s[15]++, new Uint8Array(body.length + final.length + tag.length));
  cov_29o9z2kkvr.s[16]++;
  data.set(body);
  cov_29o9z2kkvr.s[17]++;
  data.set(final, body.length);
  cov_29o9z2kkvr.s[18]++;
  data.set(tag, body.length + final.length);
  cov_29o9z2kkvr.s[19]++;
  return data;
}
function decrypt(data, key, _ref2, nodeCrypto) {
  var _ref2$name = _ref2.name,
      name = _ref2$name === void 0 ? (cov_29o9z2kkvr.b[3][0]++, 'AES-GCM') : _ref2$name,
      iv = _ref2.iv,
      additionalData = _ref2.additionalData,
      tagLength = _ref2.tagLength;
  cov_29o9z2kkvr.f[1]++;
  var alg = (cov_29o9z2kkvr.s[20]++, _params_js__WEBPACK_IMPORTED_MODULE_0__["default"].ciphers[name].nodePrefix);
  cov_29o9z2kkvr.s[21]++;
  alg = "".concat(alg, "-").concat((key.byteLength * 8).toString(), "-");
  cov_29o9z2kkvr.s[22]++;
  alg = alg + _params_js__WEBPACK_IMPORTED_MODULE_0__["default"].ciphers[name].nodeSuffix;
  var decipher;
  var body;
  cov_29o9z2kkvr.s[23]++;

  switch (name) {
    case 'AES-GCM':
      cov_29o9z2kkvr.b[4][0]++;
      {
        cov_29o9z2kkvr.s[24]++;
        decipher = nodeCrypto.createDecipheriv(alg, key, iv, {
          authTagLength: tagLength
        });
        cov_29o9z2kkvr.s[25]++;
        decipher.setAAD(additionalData);
        cov_29o9z2kkvr.s[26]++;
        body = data.slice(0, data.length - tagLength);
        var tag = (cov_29o9z2kkvr.s[27]++, data.slice(data.length - tagLength));
        cov_29o9z2kkvr.s[28]++;
        decipher.setAuthTag(tag);
        cov_29o9z2kkvr.s[29]++;
        break;
      }

    case 'AES-CBC':
      cov_29o9z2kkvr.b[4][1]++;
      {
        cov_29o9z2kkvr.s[30]++;
        decipher = nodeCrypto.createDecipheriv(alg, key, iv);
        cov_29o9z2kkvr.s[31]++;
        body = data;
        cov_29o9z2kkvr.s[32]++;
        break;
      }

    default:
      cov_29o9z2kkvr.b[4][2]++;
      cov_29o9z2kkvr.s[33]++;
      throw new Error('UnsupportedCipher');
  }

  var decryptedBody = (cov_29o9z2kkvr.s[34]++, decipher.update(body));
  var final;
  cov_29o9z2kkvr.s[35]++;

  try {
    cov_29o9z2kkvr.s[36]++;
    final = decipher.final();
  } catch (e) {
    cov_29o9z2kkvr.s[37]++;
    throw new Error('DecryptionFailure');
  }

  var msg = (cov_29o9z2kkvr.s[38]++, new Uint8Array(final.length + decryptedBody.length));
  cov_29o9z2kkvr.s[39]++;
  msg.set(decryptedBody);
  cov_29o9z2kkvr.s[40]++;
  msg.set(final, decryptedBody.length);
  cov_29o9z2kkvr.s[41]++;
  return msg;
}

/***/ }),

/***/ "./src/params.js":
/*!***********************!*\
  !*** ./src/params.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var cov_yeca1onfx = function () {
  var path = "/Users/jun/ProjectJavaScript/js_crypto_aes/src/params.js",
      hash = "c8f000e447f9e6246cc4b43dce013003c6fe57b7",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/Users/jun/ProjectJavaScript/js_crypto_aes/src/params.js",
    statementMap: {},
    fnMap: {},
    branchMap: {},
    s: {},
    f: {},
    b: {},
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

/**
 * params.js
 */
/* harmony default export */ __webpack_exports__["default"] = ({
  ciphers: {
    'AES-GCM': {
      nodePrefix: 'aes',
      nodeSuffix: 'gcm',
      ivLength: 12,
      // default value of iv length, 12 bytes is recommended for AES-GCM
      tagLength: 16,
      staticIvLength: true // if true, IV length must be always ivLength.

    },
    'AES-CBC': {
      nodePrefix: 'aes',
      nodeSuffix: 'cbc',
      ivLength: 16,
      staticIvLength: true
    }
  }
});

/***/ }),

/***/ "./src/util.js":
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/*! exports provided: getWebCryptoAll, getNodeCrypto */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getWebCryptoAll", function() { return getWebCryptoAll; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getNodeCrypto", function() { return getNodeCrypto; });
var cov_3paa7coyw = function () {
  var path = "/Users/jun/ProjectJavaScript/js_crypto_aes/src/util.js",
      hash = "e4d324f083ad65965787f40c997a04e51e3ac671",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/Users/jun/ProjectJavaScript/js_crypto_aes/src/util.js",
    statementMap: {
      "0": {
        start: {
          line: 6,
          column: 2
        },
        end: {
          line: 10,
          column: 3
        }
      },
      "1": {
        start: {
          line: 6,
          column: 37
        },
        end: {
          line: 6,
          column: 54
        }
      },
      "2": {
        start: {
          line: 8,
          column: 4
        },
        end: {
          line: 8,
          column: 55
        }
      },
      "3": {
        start: {
          line: 8,
          column: 25
        },
        end: {
          line: 8,
          column: 55
        }
      },
      "4": {
        start: {
          line: 9,
          column: 4
        },
        end: {
          line: 9,
          column: 51
        }
      },
      "5": {
        start: {
          line: 9,
          column: 23
        },
        end: {
          line: 9,
          column: 51
        }
      },
      "6": {
        start: {
          line: 14,
          column: 2
        },
        end: {
          line: 15,
          column: 32
        }
      },
      "7": {
        start: {
          line: 14,
          column: 36
        },
        end: {
          line: 14,
          column: 53
        }
      },
      "8": {
        start: {
          line: 15,
          column: 7
        },
        end: {
          line: 15,
          column: 32
        }
      }
    },
    fnMap: {
      "0": {
        name: "getWebCryptoAll",
        decl: {
          start: {
            line: 5,
            column: 16
          },
          end: {
            line: 5,
            column: 31
          }
        },
        loc: {
          start: {
            line: 5,
            column: 35
          },
          end: {
            line: 11,
            column: 1
          }
        },
        line: 5
      },
      "1": {
        name: "getNodeCrypto",
        decl: {
          start: {
            line: 13,
            column: 16
          },
          end: {
            line: 13,
            column: 29
          }
        },
        loc: {
          start: {
            line: 13,
            column: 31
          },
          end: {
            line: 16,
            column: 1
          }
        },
        line: 13
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 6,
            column: 2
          },
          end: {
            line: 10,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 6,
            column: 2
          },
          end: {
            line: 10,
            column: 3
          }
        }, {
          start: {
            line: 6,
            column: 2
          },
          end: {
            line: 10,
            column: 3
          }
        }],
        line: 6
      },
      "1": {
        loc: {
          start: {
            line: 8,
            column: 4
          },
          end: {
            line: 8,
            column: 55
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 8,
            column: 4
          },
          end: {
            line: 8,
            column: 55
          }
        }, {
          start: {
            line: 8,
            column: 4
          },
          end: {
            line: 8,
            column: 55
          }
        }],
        line: 8
      },
      "2": {
        loc: {
          start: {
            line: 9,
            column: 4
          },
          end: {
            line: 9,
            column: 51
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 9,
            column: 4
          },
          end: {
            line: 9,
            column: 51
          }
        }, {
          start: {
            line: 9,
            column: 4
          },
          end: {
            line: 9,
            column: 51
          }
        }],
        line: 9
      },
      "3": {
        loc: {
          start: {
            line: 14,
            column: 2
          },
          end: {
            line: 15,
            column: 32
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 14,
            column: 2
          },
          end: {
            line: 15,
            column: 32
          }
        }, {
          start: {
            line: 14,
            column: 2
          },
          end: {
            line: 15,
            column: 32
          }
        }],
        line: 14
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0
    },
    f: {
      "0": 0,
      "1": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0],
      "3": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

/**
 * util.js
 */
function getWebCryptoAll() {
  cov_3paa7coyw.f[0]++;
  cov_3paa7coyw.s[0]++;

  if (typeof window === 'undefined') {
    cov_3paa7coyw.b[0][0]++;
    cov_3paa7coyw.s[1]++;
    return undefined;
  } else {
    cov_3paa7coyw.b[0][1]++;
    cov_3paa7coyw.s[2]++;

    if (window.msCrypto) {
      cov_3paa7coyw.b[1][0]++;
      cov_3paa7coyw.s[3]++;
      return window.msCrypto.subtle;
    } else {
      cov_3paa7coyw.b[1][1]++;
    }

    cov_3paa7coyw.s[4]++;

    if (window.crypto) {
      cov_3paa7coyw.b[2][0]++;
      cov_3paa7coyw.s[5]++;
      return window.crypto.subtle;
    } else {
      cov_3paa7coyw.b[2][1]++;
    }
  }
}
function getNodeCrypto() {
  cov_3paa7coyw.f[1]++;
  cov_3paa7coyw.s[6]++;

  if (typeof window !== 'undefined') {
    cov_3paa7coyw.b[3][0]++;
    cov_3paa7coyw.s[7]++;
    return undefined;
  } else {
    cov_3paa7coyw.b[3][1]++;
    cov_3paa7coyw.s[8]++;
    return __webpack_require__(/*! crypto */ "crypto");
  }
}

/***/ }),

/***/ "./src/webapi.js":
/*!***********************!*\
  !*** ./src/webapi.js ***!
  \***********************/
/*! exports provided: encrypt, decrypt */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "encrypt", function() { return encrypt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decrypt", function() { return decrypt; });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
var cov_re1zlm2g6 = function () {
  var path = "/Users/jun/ProjectJavaScript/js_crypto_aes/src/webapi.js",
      hash = "f5dc356cf95e360a0be4ead2a1d7c89b37dd59a8",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/Users/jun/ProjectJavaScript/js_crypto_aes/src/webapi.js",
    statementMap: {
      "0": {
        start: {
          line: 8,
          column: 2
        },
        end: {
          line: 16,
          column: 3
        }
      },
      "1": {
        start: {
          line: 10,
          column: 4
        },
        end: {
          line: 10,
          column: 115
        }
      },
      "2": {
        start: {
          line: 11,
          column: 4
        },
        end: {
          line: 11,
          column: 10
        }
      },
      "3": {
        start: {
          line: 13,
          column: 18
        },
        end: {
          line: 13,
          column: 35
        }
      },
      "4": {
        start: {
          line: 14,
          column: 4
        },
        end: {
          line: 14,
          column: 10
        }
      },
      "5": {
        start: {
          line: 15,
          column: 11
        },
        end: {
          line: 15,
          column: 48
        }
      },
      "6": {
        start: {
          line: 18,
          column: 2
        },
        end: {
          line: 34,
          column: 3
        }
      },
      "7": {
        start: {
          line: 20,
          column: 26
        },
        end: {
          line: 20,
          column: 99
        }
      },
      "8": {
        start: {
          line: 21,
          column: 17
        },
        end: {
          line: 21,
          column: 65
        }
      },
      "9": {
        start: {
          line: 22,
          column: 4
        },
        end: {
          line: 22,
          column: 32
        }
      },
      "10": {
        start: {
          line: 25,
          column: 26
        },
        end: {
          line: 25,
          column: 102
        }
      },
      "11": {
        start: {
          line: 26,
          column: 25
        },
        end: {
          line: 26,
          column: 76
        }
      },
      "12": {
        start: {
          line: 28,
          column: 4
        },
        end: {
          line: 33,
          column: 47
        }
      },
      "13": {
        start: {
          line: 29,
          column: 19
        },
        end: {
          line: 29,
          column: 99
        }
      },
      "14": {
        start: {
          line: 30,
          column: 6
        },
        end: {
          line: 30,
          column: 56
        }
      },
      "15": {
        start: {
          line: 31,
          column: 6
        },
        end: {
          line: 31,
          column: 85
        }
      },
      "16": {
        start: {
          line: 32,
          column: 6
        },
        end: {
          line: 32,
          column: 18
        }
      },
      "17": {
        start: {
          line: 33,
          column: 11
        },
        end: {
          line: 33,
          column: 47
        }
      },
      "18": {
        start: {
          line: 39,
          column: 2
        },
        end: {
          line: 47,
          column: 3
        }
      },
      "19": {
        start: {
          line: 41,
          column: 4
        },
        end: {
          line: 41,
          column: 115
        }
      },
      "20": {
        start: {
          line: 42,
          column: 4
        },
        end: {
          line: 42,
          column: 10
        }
      },
      "21": {
        start: {
          line: 44,
          column: 18
        },
        end: {
          line: 44,
          column: 35
        }
      },
      "22": {
        start: {
          line: 45,
          column: 4
        },
        end: {
          line: 45,
          column: 10
        }
      },
      "23": {
        start: {
          line: 46,
          column: 11
        },
        end: {
          line: 46,
          column: 48
        }
      },
      "24": {
        start: {
          line: 49,
          column: 2
        },
        end: {
          line: 72,
          column: 3
        }
      },
      "25": {
        start: {
          line: 51,
          column: 26
        },
        end: {
          line: 51,
          column: 99
        }
      },
      "26": {
        start: {
          line: 52,
          column: 16
        },
        end: {
          line: 54,
          column: 6
        }
      },
      "27": {
        start: {
          line: 53,
          column: 6
        },
        end: {
          line: 53,
          column: 43
        }
      },
      "28": {
        start: {
          line: 55,
          column: 4
        },
        end: {
          line: 55,
          column: 31
        }
      },
      "29": {
        start: {
          line: 58,
          column: 26
        },
        end: {
          line: 58,
          column: 102
        }
      },
      "30": {
        start: {
          line: 59,
          column: 4
        },
        end: {
          line: 71,
          column: 5
        }
      },
      "31": {
        start: {
          line: 60,
          column: 25
        },
        end: {
          line: 60,
          column: 63
        }
      },
      "32": {
        start: {
          line: 61,
          column: 18
        },
        end: {
          line: 61,
          column: 66
        }
      },
      "33": {
        start: {
          line: 62,
          column: 18
        },
        end: {
          line: 64,
          column: 8
        }
      },
      "34": {
        start: {
          line: 63,
          column: 8
        },
        end: {
          line: 63,
          column: 45
        }
      },
      "35": {
        start: {
          line: 65,
          column: 6
        },
        end: {
          line: 65,
          column: 33
        }
      },
      "36": {
        start: {
          line: 67,
          column: 18
        },
        end: {
          line: 69,
          column: 8
        }
      },
      "37": {
        start: {
          line: 68,
          column: 8
        },
        end: {
          line: 68,
          column: 45
        }
      },
      "38": {
        start: {
          line: 70,
          column: 6
        },
        end: {
          line: 70,
          column: 33
        }
      },
      "39": {
        start: {
          line: 77,
          column: 20
        },
        end: {
          line: 81,
          column: 2
        }
      },
      "40": {
        start: {
          line: 77,
          column: 61
        },
        end: {
          line: 81,
          column: 2
        }
      },
      "41": {
        start: {
          line: 78,
          column: 13
        },
        end: {
          line: 78,
          column: 58
        }
      },
      "42": {
        start: {
          line: 79,
          column: 2
        },
        end: {
          line: 79,
          column: 59
        }
      },
      "43": {
        start: {
          line: 79,
          column: 29
        },
        end: {
          line: 79,
          column: 56
        }
      },
      "44": {
        start: {
          line: 80,
          column: 2
        },
        end: {
          line: 80,
          column: 55
        }
      },
      "45": {
        start: {
          line: 80,
          column: 23
        },
        end: {
          line: 80,
          column: 52
        }
      },
      "46": {
        start: {
          line: 82,
          column: 18
        },
        end: {
          line: 86,
          column: 2
        }
      },
      "47": {
        start: {
          line: 82,
          column: 48
        },
        end: {
          line: 86,
          column: 2
        }
      },
      "48": {
        start: {
          line: 83,
          column: 13
        },
        end: {
          line: 83,
          column: 45
        }
      },
      "49": {
        start: {
          line: 84,
          column: 2
        },
        end: {
          line: 84,
          column: 59
        }
      },
      "50": {
        start: {
          line: 84,
          column: 29
        },
        end: {
          line: 84,
          column: 56
        }
      },
      "51": {
        start: {
          line: 85,
          column: 2
        },
        end: {
          line: 85,
          column: 54
        }
      },
      "52": {
        start: {
          line: 85,
          column: 23
        },
        end: {
          line: 85,
          column: 51
        }
      },
      "53": {
        start: {
          line: 87,
          column: 18
        },
        end: {
          line: 91,
          column: 2
        }
      },
      "54": {
        start: {
          line: 87,
          column: 49
        },
        end: {
          line: 91,
          column: 2
        }
      },
      "55": {
        start: {
          line: 88,
          column: 13
        },
        end: {
          line: 88,
          column: 46
        }
      },
      "56": {
        start: {
          line: 89,
          column: 2
        },
        end: {
          line: 89,
          column: 59
        }
      },
      "57": {
        start: {
          line: 89,
          column: 29
        },
        end: {
          line: 89,
          column: 56
        }
      },
      "58": {
        start: {
          line: 90,
          column: 2
        },
        end: {
          line: 90,
          column: 54
        }
      },
      "59": {
        start: {
          line: 90,
          column: 23
        },
        end: {
          line: 90,
          column: 51
        }
      }
    },
    fnMap: {
      "0": {
        name: "encrypt",
        decl: {
          start: {
            line: 5,
            column: 22
          },
          end: {
            line: 5,
            column: 29
          }
        },
        loc: {
          start: {
            line: 5,
            column: 102
          },
          end: {
            line: 35,
            column: 1
          }
        },
        line: 5
      },
      "1": {
        name: "decrypt",
        decl: {
          start: {
            line: 37,
            column: 22
          },
          end: {
            line: 37,
            column: 29
          }
        },
        loc: {
          start: {
            line: 37,
            column: 101
          },
          end: {
            line: 73,
            column: 1
          }
        },
        line: 37
      },
      "2": {
        name: "(anonymous_2)",
        decl: {
          start: {
            line: 52,
            column: 72
          },
          end: {
            line: 52,
            column: 73
          }
        },
        loc: {
          start: {
            line: 52,
            column: 78
          },
          end: {
            line: 54,
            column: 5
          }
        },
        line: 52
      },
      "3": {
        name: "(anonymous_3)",
        decl: {
          start: {
            line: 62,
            column: 105
          },
          end: {
            line: 62,
            column: 106
          }
        },
        loc: {
          start: {
            line: 62,
            column: 111
          },
          end: {
            line: 64,
            column: 7
          }
        },
        line: 62
      },
      "4": {
        name: "(anonymous_4)",
        decl: {
          start: {
            line: 67,
            column: 77
          },
          end: {
            line: 67,
            column: 78
          }
        },
        loc: {
          start: {
            line: 67,
            column: 83
          },
          end: {
            line: 69,
            column: 7
          }
        },
        line: 67
      },
      "5": {
        name: "(anonymous_5)",
        decl: {
          start: {
            line: 77,
            column: 20
          },
          end: {
            line: 77,
            column: 21
          }
        },
        loc: {
          start: {
            line: 77,
            column: 61
          },
          end: {
            line: 81,
            column: 2
          }
        },
        line: 77
      },
      "6": {
        name: "(anonymous_6)",
        decl: {
          start: {
            line: 77,
            column: 75
          },
          end: {
            line: 77,
            column: 76
          }
        },
        loc: {
          start: {
            line: 77,
            column: 96
          },
          end: {
            line: 81,
            column: 1
          }
        },
        line: 77
      },
      "7": {
        name: "(anonymous_7)",
        decl: {
          start: {
            line: 79,
            column: 18
          },
          end: {
            line: 79,
            column: 19
          }
        },
        loc: {
          start: {
            line: 79,
            column: 27
          },
          end: {
            line: 79,
            column: 58
          }
        },
        line: 79
      },
      "8": {
        name: "(anonymous_8)",
        decl: {
          start: {
            line: 80,
            column: 15
          },
          end: {
            line: 80,
            column: 16
          }
        },
        loc: {
          start: {
            line: 80,
            column: 21
          },
          end: {
            line: 80,
            column: 54
          }
        },
        line: 80
      },
      "9": {
        name: "(anonymous_9)",
        decl: {
          start: {
            line: 82,
            column: 18
          },
          end: {
            line: 82,
            column: 19
          }
        },
        loc: {
          start: {
            line: 82,
            column: 48
          },
          end: {
            line: 86,
            column: 2
          }
        },
        line: 82
      },
      "10": {
        name: "(anonymous_10)",
        decl: {
          start: {
            line: 82,
            column: 62
          },
          end: {
            line: 82,
            column: 63
          }
        },
        loc: {
          start: {
            line: 82,
            column: 83
          },
          end: {
            line: 86,
            column: 1
          }
        },
        line: 82
      },
      "11": {
        name: "(anonymous_11)",
        decl: {
          start: {
            line: 84,
            column: 18
          },
          end: {
            line: 84,
            column: 19
          }
        },
        loc: {
          start: {
            line: 84,
            column: 27
          },
          end: {
            line: 84,
            column: 58
          }
        },
        line: 84
      },
      "12": {
        name: "(anonymous_12)",
        decl: {
          start: {
            line: 85,
            column: 15
          },
          end: {
            line: 85,
            column: 16
          }
        },
        loc: {
          start: {
            line: 85,
            column: 21
          },
          end: {
            line: 85,
            column: 53
          }
        },
        line: 85
      },
      "13": {
        name: "(anonymous_13)",
        decl: {
          start: {
            line: 87,
            column: 18
          },
          end: {
            line: 87,
            column: 19
          }
        },
        loc: {
          start: {
            line: 87,
            column: 49
          },
          end: {
            line: 91,
            column: 2
          }
        },
        line: 87
      },
      "14": {
        name: "(anonymous_14)",
        decl: {
          start: {
            line: 87,
            column: 63
          },
          end: {
            line: 87,
            column: 64
          }
        },
        loc: {
          start: {
            line: 87,
            column: 84
          },
          end: {
            line: 91,
            column: 1
          }
        },
        line: 87
      },
      "15": {
        name: "(anonymous_15)",
        decl: {
          start: {
            line: 89,
            column: 18
          },
          end: {
            line: 89,
            column: 19
          }
        },
        loc: {
          start: {
            line: 89,
            column: 27
          },
          end: {
            line: 89,
            column: 58
          }
        },
        line: 89
      },
      "16": {
        name: "(anonymous_16)",
        decl: {
          start: {
            line: 90,
            column: 15
          },
          end: {
            line: 90,
            column: 16
          }
        },
        loc: {
          start: {
            line: 90,
            column: 21
          },
          end: {
            line: 90,
            column: 53
          }
        },
        line: 90
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 5,
            column: 41
          },
          end: {
            line: 5,
            column: 57
          }
        },
        type: "default-arg",
        locations: [{
          start: {
            line: 5,
            column: 48
          },
          end: {
            line: 5,
            column: 57
          }
        }],
        line: 5
      },
      "1": {
        loc: {
          start: {
            line: 8,
            column: 2
          },
          end: {
            line: 16,
            column: 3
          }
        },
        type: "switch",
        locations: [{
          start: {
            line: 9,
            column: 2
          },
          end: {
            line: 12,
            column: 3
          }
        }, {
          start: {
            line: 13,
            column: 2
          },
          end: {
            line: 14,
            column: 10
          }
        }, {
          start: {
            line: 15,
            column: 2
          },
          end: {
            line: 15,
            column: 48
          }
        }],
        line: 8
      },
      "2": {
        loc: {
          start: {
            line: 10,
            column: 62
          },
          end: {
            line: 10,
            column: 113
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 10,
            column: 92
          },
          end: {
            line: 10,
            column: 108
          }
        }, {
          start: {
            line: 10,
            column: 111
          },
          end: {
            line: 10,
            column: 113
          }
        }],
        line: 10
      },
      "3": {
        loc: {
          start: {
            line: 18,
            column: 2
          },
          end: {
            line: 34,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 18,
            column: 2
          },
          end: {
            line: 34,
            column: 3
          }
        }, {
          start: {
            line: 18,
            column: 2
          },
          end: {
            line: 34,
            column: 3
          }
        }],
        line: 18
      },
      "4": {
        loc: {
          start: {
            line: 28,
            column: 4
          },
          end: {
            line: 33,
            column: 47
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 28,
            column: 4
          },
          end: {
            line: 33,
            column: 47
          }
        }, {
          start: {
            line: 28,
            column: 4
          },
          end: {
            line: 33,
            column: 47
          }
        }],
        line: 28
      },
      "5": {
        loc: {
          start: {
            line: 37,
            column: 42
          },
          end: {
            line: 37,
            column: 56
          }
        },
        type: "default-arg",
        locations: [{
          start: {
            line: 37,
            column: 47
          },
          end: {
            line: 37,
            column: 56
          }
        }],
        line: 37
      },
      "6": {
        loc: {
          start: {
            line: 39,
            column: 2
          },
          end: {
            line: 47,
            column: 3
          }
        },
        type: "switch",
        locations: [{
          start: {
            line: 40,
            column: 2
          },
          end: {
            line: 43,
            column: 3
          }
        }, {
          start: {
            line: 44,
            column: 2
          },
          end: {
            line: 45,
            column: 10
          }
        }, {
          start: {
            line: 46,
            column: 2
          },
          end: {
            line: 46,
            column: 48
          }
        }],
        line: 39
      },
      "7": {
        loc: {
          start: {
            line: 41,
            column: 62
          },
          end: {
            line: 41,
            column: 113
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 41,
            column: 92
          },
          end: {
            line: 41,
            column: 108
          }
        }, {
          start: {
            line: 41,
            column: 111
          },
          end: {
            line: 41,
            column: 113
          }
        }],
        line: 41
      },
      "8": {
        loc: {
          start: {
            line: 49,
            column: 2
          },
          end: {
            line: 72,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 49,
            column: 2
          },
          end: {
            line: 72,
            column: 3
          }
        }, {
          start: {
            line: 49,
            column: 2
          },
          end: {
            line: 72,
            column: 3
          }
        }],
        line: 49
      },
      "9": {
        loc: {
          start: {
            line: 59,
            column: 4
          },
          end: {
            line: 71,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 59,
            column: 4
          },
          end: {
            line: 71,
            column: 5
          }
        }, {
          start: {
            line: 59,
            column: 4
          },
          end: {
            line: 71,
            column: 5
          }
        }],
        line: 59
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0,
      "24": 0,
      "25": 0,
      "26": 0,
      "27": 0,
      "28": 0,
      "29": 0,
      "30": 0,
      "31": 0,
      "32": 0,
      "33": 0,
      "34": 0,
      "35": 0,
      "36": 0,
      "37": 0,
      "38": 0,
      "39": 0,
      "40": 0,
      "41": 0,
      "42": 0,
      "43": 0,
      "44": 0,
      "45": 0,
      "46": 0,
      "47": 0,
      "48": 0,
      "49": 0,
      "50": 0,
      "51": 0,
      "52": 0,
      "53": 0,
      "54": 0,
      "55": 0,
      "56": 0,
      "57": 0,
      "58": 0,
      "59": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0
    },
    b: {
      "0": [0],
      "1": [0, 0, 0],
      "2": [0, 0],
      "3": [0, 0],
      "4": [0, 0],
      "5": [0],
      "6": [0, 0, 0],
      "7": [0, 0],
      "8": [0, 0],
      "9": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();




/**
 * webapi.js
 */
function encrypt(_x, _x2, _x3, _x4) {
  return _encrypt.apply(this, arguments);
}

function _encrypt() {
  _encrypt = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()(
  /*#__PURE__*/
  _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(msg, key, _ref, webCrypto) {
    var _ref$name, name, iv, additionalData, tagLength, alg, sessionKeyObj, data, _sessionKeyObj, encryptedObj, _data;

    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _ref$name = _ref.name, name = _ref$name === void 0 ? (cov_re1zlm2g6.b[0][0]++, 'AES-GCM') : _ref$name, iv = _ref.iv, additionalData = _ref.additionalData, tagLength = _ref.tagLength;
            cov_re1zlm2g6.f[0]++;
            cov_re1zlm2g6.s[0]++;
            _context.t0 = name;
            _context.next = _context.t0 === 'AES-GCM' ? 6 : _context.t0 === 'AES-CBC' ? 11 : 16;
            break;

          case 6:
            cov_re1zlm2g6.b[1][0]++;
            cov_re1zlm2g6.s[1]++;
            alg = Object.assign({
              name: name,
              iv: iv,
              tagLength: tagLength * 8
            }, additionalData.length > 0 ? (cov_re1zlm2g6.b[2][0]++, {
              additionalData: additionalData
            }) : (cov_re1zlm2g6.b[2][1]++, {}));
            cov_re1zlm2g6.s[2]++;
            return _context.abrupt("break", 19);

          case 11:
            cov_re1zlm2g6.b[1][1]++;
            cov_re1zlm2g6.s[3]++;
            alg = {
              name: name,
              iv: iv
            };
            cov_re1zlm2g6.s[4]++;
            return _context.abrupt("break", 19);

          case 16:
            cov_re1zlm2g6.b[1][2]++;
            cov_re1zlm2g6.s[5]++;
            throw new Error('UnsupportedCipher');

          case 19:
            cov_re1zlm2g6.s[6]++;

            if (!(typeof window.msCrypto === 'undefined')) {
              _context.next = 34;
              break;
            }

            cov_re1zlm2g6.b[3][0]++;
            cov_re1zlm2g6.s[7]++;
            _context.next = 25;
            return webCrypto.importKey('raw', key, alg, false, ['encrypt', 'decrypt']);

          case 25:
            sessionKeyObj = _context.sent;
            cov_re1zlm2g6.s[8]++;
            _context.next = 29;
            return webCrypto.encrypt(alg, sessionKeyObj, msg);

          case 29:
            data = _context.sent;
            cov_re1zlm2g6.s[9]++;
            return _context.abrupt("return", new Uint8Array(data));

          case 34:
            cov_re1zlm2g6.b[3][1]++;
            cov_re1zlm2g6.s[10]++;
            _context.next = 38;
            return msImportKey('raw', key, alg, false, ['encrypt', 'decrypt'], webCrypto);

          case 38:
            _sessionKeyObj = _context.sent;
            cov_re1zlm2g6.s[11]++;
            _context.next = 42;
            return msEncrypt(alg, _sessionKeyObj, msg, webCrypto);

          case 42:
            encryptedObj = _context.sent;
            cov_re1zlm2g6.s[12]++;

            if (!(name === 'AES-GCM')) {
              _context.next = 55;
              break;
            }

            cov_re1zlm2g6.b[4][0]++;
            _data = (cov_re1zlm2g6.s[13]++, new Uint8Array(encryptedObj.ciphertext.byteLength + encryptedObj.tag.byteLength));
            cov_re1zlm2g6.s[14]++;

            _data.set(new Uint8Array(encryptedObj.ciphertext));

            cov_re1zlm2g6.s[15]++;

            _data.set(new Uint8Array(encryptedObj.tag), encryptedObj.ciphertext.byteLength);

            cov_re1zlm2g6.s[16]++;
            return _context.abrupt("return", _data);

          case 55:
            cov_re1zlm2g6.b[4][1]++;
            cov_re1zlm2g6.s[17]++;
            return _context.abrupt("return", new Uint8Array(encryptedObj));

          case 58:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _encrypt.apply(this, arguments);
}

function decrypt(_x5, _x6, _x7, _x8) {
  return _decrypt.apply(this, arguments);
} // function definitions for IE

function _decrypt() {
  _decrypt = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()(
  /*#__PURE__*/
  _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(data, key, _ref2, webCrypto) {
    var _ref2$name, name, iv, additionalData, tagLength, alg, sessionKeyObj, msg, _sessionKeyObj2, ciphertext, tag, _msg, _msg2;

    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _ref2$name = _ref2.name, name = _ref2$name === void 0 ? (cov_re1zlm2g6.b[5][0]++, 'AES-GCM') : _ref2$name, iv = _ref2.iv, additionalData = _ref2.additionalData, tagLength = _ref2.tagLength;
            cov_re1zlm2g6.f[1]++;
            cov_re1zlm2g6.s[18]++;
            _context2.t0 = name;
            _context2.next = _context2.t0 === 'AES-GCM' ? 6 : _context2.t0 === 'AES-CBC' ? 11 : 16;
            break;

          case 6:
            cov_re1zlm2g6.b[6][0]++;
            cov_re1zlm2g6.s[19]++;
            alg = Object.assign({
              name: name,
              iv: iv,
              tagLength: tagLength * 8
            }, additionalData.length > 0 ? (cov_re1zlm2g6.b[7][0]++, {
              additionalData: additionalData
            }) : (cov_re1zlm2g6.b[7][1]++, {}));
            cov_re1zlm2g6.s[20]++;
            return _context2.abrupt("break", 19);

          case 11:
            cov_re1zlm2g6.b[6][1]++;
            cov_re1zlm2g6.s[21]++;
            alg = {
              name: name,
              iv: iv
            };
            cov_re1zlm2g6.s[22]++;
            return _context2.abrupt("break", 19);

          case 16:
            cov_re1zlm2g6.b[6][2]++;
            cov_re1zlm2g6.s[23]++;
            throw new Error('UnsupportedCipher');

          case 19:
            cov_re1zlm2g6.s[24]++;

            if (window.msCrypto) {
              _context2.next = 34;
              break;
            }

            cov_re1zlm2g6.b[8][0]++;
            cov_re1zlm2g6.s[25]++;
            _context2.next = 25;
            return webCrypto.importKey('raw', key, alg, false, ['encrypt', 'decrypt']);

          case 25:
            sessionKeyObj = _context2.sent;
            cov_re1zlm2g6.s[26]++;
            _context2.next = 29;
            return webCrypto.decrypt(alg, sessionKeyObj, data).catch(function () {
              cov_re1zlm2g6.f[2]++;
              cov_re1zlm2g6.s[27]++;
              throw new Error('DecryptionFailure');
            });

          case 29:
            msg = _context2.sent;
            cov_re1zlm2g6.s[28]++;
            return _context2.abrupt("return", new Uint8Array(msg));

          case 34:
            cov_re1zlm2g6.b[8][1]++;
            cov_re1zlm2g6.s[29]++;
            _context2.next = 38;
            return msImportKey('raw', key, alg, false, ['encrypt', 'decrypt'], webCrypto);

          case 38:
            _sessionKeyObj2 = _context2.sent;
            cov_re1zlm2g6.s[30]++;

            if (!(name === 'AES-GCM')) {
              _context2.next = 52;
              break;
            }

            cov_re1zlm2g6.b[9][0]++;
            ciphertext = (cov_re1zlm2g6.s[31]++, data.slice(0, data.length - tagLength));
            tag = (cov_re1zlm2g6.s[32]++, data.slice(data.length - tagLength, data.length));
            cov_re1zlm2g6.s[33]++;
            _context2.next = 47;
            return msDecrypt(Object.assign(alg, {
              tag: tag
            }), _sessionKeyObj2, ciphertext, webCrypto).catch(function () {
              cov_re1zlm2g6.f[3]++;
              cov_re1zlm2g6.s[34]++;
              throw new Error('DecryptionFailure');
            });

          case 47:
            _msg = _context2.sent;
            cov_re1zlm2g6.s[35]++;
            return _context2.abrupt("return", new Uint8Array(_msg));

          case 52:
            cov_re1zlm2g6.b[9][1]++;
            cov_re1zlm2g6.s[36]++;
            _context2.next = 56;
            return msDecrypt(alg, _sessionKeyObj2, data, webCrypto).catch(function () {
              cov_re1zlm2g6.f[4]++;
              cov_re1zlm2g6.s[37]++;
              throw new Error('DecryptionFailure');
            });

          case 56:
            _msg2 = _context2.sent;
            cov_re1zlm2g6.s[38]++;
            return _context2.abrupt("return", new Uint8Array(_msg2));

          case 59:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _decrypt.apply(this, arguments);
}

cov_re1zlm2g6.s[39]++;

var msImportKey = function msImportKey(type, key, alg, ext, use, webCrypto) {
  cov_re1zlm2g6.f[5]++;
  cov_re1zlm2g6.s[40]++;
  return new Promise(function (resolve, reject) {
    cov_re1zlm2g6.f[6]++;
    var op = (cov_re1zlm2g6.s[41]++, webCrypto.importKey(type, key, alg, ext, use));
    cov_re1zlm2g6.s[42]++;

    op.oncomplete = function (evt) {
      cov_re1zlm2g6.f[7]++;
      cov_re1zlm2g6.s[43]++;
      resolve(evt.target.result);
    };

    cov_re1zlm2g6.s[44]++;

    op.onerror = function () {
      cov_re1zlm2g6.f[8]++;
      cov_re1zlm2g6.s[45]++;
      reject('KeyImportingFailed');
    };
  });
};

cov_re1zlm2g6.s[46]++;

var msEncrypt = function msEncrypt(alg, key, msg, webCrypto) {
  cov_re1zlm2g6.f[9]++;
  cov_re1zlm2g6.s[47]++;
  return new Promise(function (resolve, reject) {
    cov_re1zlm2g6.f[10]++;
    var op = (cov_re1zlm2g6.s[48]++, webCrypto.encrypt(alg, key, msg));
    cov_re1zlm2g6.s[49]++;

    op.oncomplete = function (evt) {
      cov_re1zlm2g6.f[11]++;
      cov_re1zlm2g6.s[50]++;
      resolve(evt.target.result);
    };

    cov_re1zlm2g6.s[51]++;

    op.onerror = function () {
      cov_re1zlm2g6.f[12]++;
      cov_re1zlm2g6.s[52]++;
      reject('EncryptionFailure');
    };
  });
};

cov_re1zlm2g6.s[53]++;

var msDecrypt = function msDecrypt(alg, key, data, webCrypto) {
  cov_re1zlm2g6.f[13]++;
  cov_re1zlm2g6.s[54]++;
  return new Promise(function (resolve, reject) {
    cov_re1zlm2g6.f[14]++;
    var op = (cov_re1zlm2g6.s[55]++, webCrypto.decrypt(alg, key, data));
    cov_re1zlm2g6.s[56]++;

    op.oncomplete = function (evt) {
      cov_re1zlm2g6.f[15]++;
      cov_re1zlm2g6.s[57]++;
      resolve(evt.target.result);
    };

    cov_re1zlm2g6.s[58]++;

    op.onerror = function () {
      cov_re1zlm2g6.f[16]++;
      cov_re1zlm2g6.s[59]++;
      reject('DecryptionFailure');
    };
  });
};

/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./src/index.js */"./src/index.js");


/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_crypto__;

/***/ })

/******/ });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qc2NhZXMvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2pzY2Flcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9qc2NhZXMvLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hc3luY1RvR2VuZXJhdG9yLmpzIiwid2VicGFjazovL2pzY2Flcy8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9ub2RlX21vZHVsZXMvcmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lLW1vZHVsZS5qcyIsIndlYnBhY2s6Ly9qc2NhZXMvLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvbm9kZV9tb2R1bGVzL3JlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZS5qcyIsIndlYnBhY2s6Ly9qc2NhZXMvLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvcmVnZW5lcmF0b3IvaW5kZXguanMiLCJ3ZWJwYWNrOi8vanNjYWVzLy4vc3JjL2Flcy5qcyIsIndlYnBhY2s6Ly9qc2NhZXMvLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vanNjYWVzLy4vc3JjL25vZGVhcGkuanMiLCJ3ZWJwYWNrOi8vanNjYWVzLy4vc3JjL3BhcmFtcy5qcyIsIndlYnBhY2s6Ly9qc2NhZXMvLi9zcmMvdXRpbC5qcyIsIndlYnBhY2s6Ly9qc2NhZXMvLi9zcmMvd2ViYXBpLmpzIiwid2VicGFjazovL2pzY2Flcy9leHRlcm5hbCBcImNyeXB0b1wiIl0sIm5hbWVzIjpbImFzc2VydEFsZ29yaXRobXMiLCJuYW1lIiwiaXYiLCJ0YWdMZW5ndGgiLCJPYmplY3QiLCJrZXlzIiwicGFyYW1zIiwiY2lwaGVycyIsImluZGV4T2YiLCJFcnJvciIsIml2TGVuZ3RoIiwiVWludDhBcnJheSIsImJ5dGVMZW5ndGgiLCJzdGF0aWNJdkxlbmd0aCIsIk51bWJlciIsImlzSW50ZWdlciIsImVuY3J5cHQiLCJtc2ciLCJrZXkiLCJhZGRpdGlvbmFsRGF0YSIsInV0aWwiLCJ3ZWJDcnlwdG8iLCJub2RlQ3J5cHRvIiwibmF0aXZlIiwiaW1wb3J0S2V5Iiwid2ViYXBpIiwiY2F0Y2giLCJkYXRhIiwibm9kZWFwaSIsImUiLCJkZWNyeXB0IiwiZXJyTXNnIiwibWVzc2FnZSIsImFsZyIsIm5vZGVQcmVmaXgiLCJ0b1N0cmluZyIsIm5vZGVTdWZmaXgiLCJjaXBoZXIiLCJjcmVhdGVDaXBoZXJpdiIsImF1dGhUYWdMZW5ndGgiLCJzZXRBQUQiLCJib2R5IiwidXBkYXRlIiwiZmluYWwiLCJ0YWciLCJnZXRBdXRoVGFnIiwibGVuZ3RoIiwic2V0IiwiZGVjaXBoZXIiLCJjcmVhdGVEZWNpcGhlcml2Iiwic2xpY2UiLCJzZXRBdXRoVGFnIiwiZGVjcnlwdGVkQm9keSIsImdldFdlYkNyeXB0b0FsbCIsIndpbmRvdyIsInVuZGVmaW5lZCIsIm1zQ3J5cHRvIiwic3VidGxlIiwiY3J5cHRvIiwiZ2V0Tm9kZUNyeXB0byIsInJlcXVpcmUiLCJhc3NpZ24iLCJzZXNzaW9uS2V5T2JqIiwibXNJbXBvcnRLZXkiLCJtc0VuY3J5cHQiLCJlbmNyeXB0ZWRPYmoiLCJjaXBoZXJ0ZXh0IiwibXNEZWNyeXB0IiwidHlwZSIsImV4dCIsInVzZSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwib3AiLCJvbmNvbXBsZXRlIiwiZXZ0IiwidGFyZ2V0IiwicmVzdWx0Iiwib25lcnJvciJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSxtQzs7Ozs7Ozs7Ozs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUJBQWlCLG1CQUFPLENBQUMsNEZBQVc7O0FBRXBDO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2QsS0FBSztBQUNMLGNBQWM7QUFDZDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RDtBQUN6RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxXQUFXO0FBQ1g7O0FBRUE7QUFDQTtBQUNBLHdDQUF3QyxXQUFXO0FBQ25EO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9DQUFvQyxjQUFjO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQ0FBaUMsa0JBQWtCO0FBQ25EO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0E5Qzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7OztBQU1BLFNBQVNBLGdCQUFULE9BQWdEO0FBQUEsTUFBckJDLElBQXFCLFFBQXJCQSxJQUFxQjtBQUFBLE1BQWZDLEVBQWUsUUFBZkEsRUFBZTtBQUFBLE1BQVhDLFNBQVcsUUFBWEEsU0FBVztBQUFBO0FBQUE7O0FBQzlDLE1BQUdDLE1BQU0sQ0FBQ0Ms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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2ZEOzs7QUFJTyxTQUFlNUMsT0FBdEI7QUFBQTtBQUFBOzs7Ozt5RUFBTyxpQkFBdUJDLEdBQXZCLEVBQTRCQyxHQUE1QixRQUFvRkcsU0FBcEY7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLDZCQUFrQ3BCLElBQWxDLEVBQWtDQSxJQUFsQyxvREFBeUMsU0FBekMsZUFBb0RDLEVBQXBELFFBQW9EQSxFQUFwRCxFQUF3RGlCLGNBQXhELFFBQXdEQSxjQUF4RCxFQUF3RWhCLFNBQXhFLFFBQXdFQSxTQUF4RTtBQUFBO0FBQUE7QUFBQSwwQkFHRUYsSUFIRjtBQUFBLDRDQUlBLFNBSkEsdUJBUUEsU0FSQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUtIZ0MsZUFBRyxHQUFHN0IsTUFBTSxDQUFDeUQsTUFBUCxDQUFjO0FBQUM1RCxrQkFBSSxFQUFKQSxJQUFEO0FBQU9DLGdCQUFFLEVBQUZBLEVBQVA7QUFBV0MsdUJBQVMsRUFBRUEsU0FBUyxHQUFHO0FBQWxDLGFBQWQsRUFBcURnQixjQUFjLENBQUMyQixNQUFmLEdBQXdCLENBQXpCLDZCQUE4QjtBQUFDM0IsNEJBQWMsRUFBZEE7QUFBRCxhQUE5Qiw4QkFBaUQsRUFBakQsQ0FBcEQsQ0FBTjtBQUxHO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBUVdjLGVBQUcsR0FBRztBQUFDaEMsa0JBQUksRUFBSkEsSUFBRDtBQUFPQyxnQkFBRSxFQUFGQTtBQUFQLGFBQU47QUFSWDtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBLGtCQVVVLElBQUlPLEtBQUosQ0FBVSxtQkFBVixDQVZWOztBQUFBO0FBQUE7O0FBQUEsa0JBYUQsT0FBTzZDLE1BQU0sQ0FBQ0UsUUFBZCxLQUEyQixXQWIxQjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFleUJuQyxTQUFTLENBQUNHLFNBQVYsQ0FBb0IsS0FBcEIsRUFBMkJOLEdBQTNCLEVBQWdDZSxHQUFoQyxFQUFxQyxLQUFyQyxFQUE0QyxDQUFDLFNBQUQsRUFBWSxTQUFaLENBQTVDLENBZnpCOztBQUFBO0FBZUc2Qix5QkFmSDtBQUFBO0FBQUE7QUFBQSxtQkFnQmdCekMsU0FBUyxDQUFDTCxPQUFWLENBQWtCaUIsR0FBbEIsRUFBdUI2QixhQUF2QixFQUFzQzdDLEdBQXRDLENBaEJoQjs7QUFBQTtBQWdCR1UsZ0JBaEJIO0FBQUE7QUFBQSw2Q0FpQkksSUFBSWhCLFVBQUosQ0FBZWdCLElBQWYsQ0FqQko7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFvQnlCb0MsV0FBVyxDQUFDLEtBQUQsRUFBUTdDLEdBQVIsRUFBYWUsR0FBYixFQUFrQixLQUFsQixFQUF5QixDQUFDLFNBQUQsRUFBWSxTQUFaLENBQXpCLEVBQWlEWixTQUFqRCxDQXBCcEM7O0FBQUE7QUFvQkd5QywwQkFwQkg7QUFBQTtBQUFBO0FBQUEsbUJBcUJ3QkUsU0FBUyxDQUFDL0IsR0FBRCxFQUFNNkIsY0FBTixFQUFxQjdDLEdBQXJCLEVBQTBCSSxTQUExQixDQXJCakM7O0FBQUE7QUFxQkc0Qyx3QkFyQkg7QUFBQTs7QUFBQSxrQkF1QkNoRSxJQUFJLEtBQUssU0F2QlY7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUF3QkswQixpQkF4QkwsMkJBd0JZLElBQUloQixVQUFKLENBQWVzRCxZQUFZLENBQUNDLFVBQWIsQ0FBd0J0RCxVQUF4QixHQUFxQ3FELFlBQVksQ0FBQ3JCLEdBQWIsQ0FBaUJoQyxVQUFyRSxDQXhCWjtBQUFBOztBQXlCRGUsaUJBQUksQ0FBQ29CLEdBQUwsQ0FBUyxJQUFJcEMsVUFBSixDQUFlc0QsWUFBWSxDQUFDQyxVQUE1QixDQUFUOztBQXpCQzs7QUEwQkR2QyxpQkFBSSxDQUFDb0IsR0FBTCxDQUFTLElBQUlwQyxVQUFKLENBQWVzRCxZQUFZLENBQUNyQixHQUE1QixDQUFULEVBQTJDcUIsWUFBWSxDQUFDQyxVQUFiLENBQXdCdEQsVUFBbkU7O0FBMUJDO0FBQUEsNkNBMkJNZSxLQTNCTjs7QUFBQTtBQUFBO0FBQUE7QUFBQSw2Q0E0QlcsSUFBSWhCLFVBQUosQ0FBZXNELFlBQWYsQ0E1Qlg7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRzs7OztBQWdDQSxTQUFlbkMsT0FBdEI7QUFBQTtBQUFBLEMsQ0F1Q0E7Ozs7O3lFQXZDTyxrQkFBdUJILElBQXZCLEVBQTZCVCxHQUE3QixTQUFtRkcsU0FBbkY7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLCtCQUFtQ3BCLElBQW5DLEVBQW1DQSxJQUFuQyxxREFBd0MsU0FBeEMsZ0JBQW1EQyxFQUFuRCxTQUFtREEsRUFBbkQsRUFBdURpQixjQUF2RCxTQUF1REEsY0FBdkQsRUFBdUVoQixTQUF2RSxTQUF1RUEsU0FBdkU7QUFBQTtBQUFBO0FBQUEsMkJBRUVGLElBRkY7QUFBQSw4Q0FHQSxTQUhBLHdCQU9BLFNBUEE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFJSGdDLGVBQUcsR0FBRzdCLE1BQU0sQ0FBQ3lELE1BQVAsQ0FBYztBQUFDNUQsa0JBQUksRUFBSkEsSUFBRDtBQUFPQyxnQkFBRSxFQUFGQSxFQUFQO0FBQVdDLHVCQUFTLEVBQUVBLFNBQVMsR0FBRztBQUFsQyxhQUFkLEVBQXFEZ0IsY0FBYyxDQUFDMkIsTUFBZixHQUF3QixDQUF6Qiw2QkFBOEI7QUFBQzNCLDRCQUFjLEVBQWRBO0FBQUQsYUFBOUIsOEJBQWlELEVBQWpELENBQXBELENBQU47QUFKRztBQUFBOztBQUFBO0FBQUE7QUFBQTtBQU9XYyxlQUFHLEdBQUc7QUFBQ2hDLGtCQUFJLEVBQUpBLElBQUQ7QUFBT0MsZ0JBQUUsRUFBRkE7QUFBUCxhQUFOO0FBUFg7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQSxrQkFTVSxJQUFJTyxLQUFKLENBQVUsbUJBQVYsQ0FUVjs7QUFBQTtBQUFBOztBQUFBLGdCQVlBNkMsTUFBTSxDQUFDRSxRQVpQO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQWN5Qm5DLFNBQVMsQ0FBQ0csU0FBVixDQUFvQixLQUFwQixFQUEyQk4sR0FBM0IsRUFBZ0NlLEdBQWhDLEVBQXFDLEtBQXJDLEVBQTRDLENBQUMsU0FBRCxFQUFZLFNBQVosQ0FBNUMsQ0FkekI7O0FBQUE7QUFjRzZCLHlCQWRIO0FBQUE7QUFBQTtBQUFBLG1CQWVlekMsU0FBUyxDQUFDUyxPQUFWLENBQWtCRyxHQUFsQixFQUF1QjZCLGFBQXZCLEVBQXNDbkMsSUFBdEMsRUFBNENELEtBQTVDLENBQWtELFlBQU07QUFBQTtBQUFBO0FBQ3hFLG9CQUFNLElBQUlqQixLQUFKLENBQVUsbUJBQVYsQ0FBTjtBQUNELGFBRmlCLENBZmY7O0FBQUE7QUFlR1EsZUFmSDtBQUFBO0FBQUEsOENBa0JJLElBQUlOLFVBQUosQ0FBZU0sR0FBZixDQWxCSjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQXFCeUI4QyxXQUFXLENBQUMsS0FBRCxFQUFRN0MsR0FBUixFQUFhZSxHQUFiLEVBQWtCLEtBQWxCLEVBQXlCLENBQUMsU0FBRCxFQUFZLFNBQVosQ0FBekIsRUFBaURaLFNBQWpELENBckJwQzs7QUFBQTtBQXFCR3lDLDJCQXJCSDtBQUFBOztBQUFBLGtCQXNCQzdELElBQUksS0FBSyxTQXRCVjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQXVCS2lFLHNCQXZCTCwyQkF1QmtCdkMsSUFBSSxDQUFDdUIsS0FBTCxDQUFXLENBQVgsRUFBY3ZCLElBQUksQ0FBQ21CLE1BQUwsR0FBYzNDLFNBQTVCLENBdkJsQjtBQXdCS3lDLGVBeEJMLDJCQXdCV2pCLElBQUksQ0FBQ3VCLEtBQUwsQ0FBV3ZCLElBQUksQ0FBQ21CLE1BQUwsR0FBYzNDLFNBQXpCLEVBQW9Dd0IsSUFBSSxDQUFDbUIsTUFBekMsQ0F4Qlg7QUFBQTtBQUFBO0FBQUEsbUJBeUJpQnFCLFNBQVMsQ0FBQy9ELE1BQU0sQ0FBQ3lELE1BQVAsQ0FBYzVCLEdBQWQsRUFBbUI7QUFBQ1csaUJBQUcsRUFBSEE7QUFBRCxhQUFuQixDQUFELEVBQTRCa0IsZUFBNUIsRUFBMkNJLFVBQTNDLEVBQXVEN0MsU0FBdkQsQ0FBVCxDQUEyRUssS0FBM0UsQ0FBaUYsWUFBTTtBQUFBO0FBQUE7QUFDdkcsb0JBQU0sSUFBSWpCLEtBQUosQ0FBVSxtQkFBVixDQUFOO0FBQ0QsYUFGaUIsQ0F6QmpCOztBQUFBO0FBeUJLUSxnQkF6Qkw7QUFBQTtBQUFBLDhDQTRCTSxJQUFJTixVQUFKLENBQWVNLElBQWYsQ0E1Qk47O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkE4QmlCa0QsU0FBUyxDQUFDbEMsR0FBRCxFQUFNNkIsZUFBTixFQUFxQm5DLElBQXJCLEVBQTJCTixTQUEzQixDQUFULENBQStDSyxLQUEvQyxDQUFxRCxZQUFNO0FBQUE7QUFBQTtBQUMzRSxvQkFBTSxJQUFJakIsS0FBSixDQUFVLG1CQUFWLENBQU47QUFDRCxhQUZpQixDQTlCakI7O0FBQUE7QUE4QktRLGlCQTlCTDtBQUFBO0FBQUEsOENBaUNNLElBQUlOLFVBQUosQ0FBZU0sS0FBZixDQWpDTjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHOzs7Ozs7QUF3Q1AsSUFBTThDLFdBQVcsR0FBRyxTQUFkQSxXQUFjLENBQUNLLElBQUQsRUFBT2xELEdBQVAsRUFBWWUsR0FBWixFQUFpQm9DLEdBQWpCLEVBQXNCQyxHQUF0QixFQUEyQmpELFNBQTNCLEVBQXlDO0FBQUE7QUFBQTtBQUFBLGFBQUlrRCxPQUFKLENBQWMsVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQUE7QUFDOUYsUUFBTUMsRUFBRSwyQkFBR3JELFNBQVMsQ0FBQ0csU0FBVixDQUFvQjRDLElBQXBCLEVBQTBCbEQsR0FBMUIsRUFBK0JlLEdBQS9CLEVBQW9Db0MsR0FBcEMsRUFBeUNDLEdBQXpDLENBQUgsQ0FBUjtBQUQ4Rjs7QUFFOUZJLE1BQUUsQ0FBQ0MsVUFBSCxHQUFnQixVQUFDQyxHQUFELEVBQVM7QUFBQTtBQUFBO0FBQUVKLGFBQU8sQ0FBQ0ksR0FBRyxDQUFDQyxNQUFKLENBQVdDLE1BQVosQ0FBUDtBQUE2QixLQUF4RDs7QUFGOEY7O0FBRzlGSixNQUFFLENBQUNLLE9BQUgsR0FBYSxZQUFNO0FBQUE7QUFBQTtBQUFFTixZQUFNLENBQUMsb0JBQUQsQ0FBTjtBQUErQixLQUFwRDtBQUNELEdBSjREO0FBSTNELENBSkY7Ozs7QUFLQSxJQUFNVCxTQUFTLEdBQUcsU0FBWkEsU0FBWSxDQUFDL0IsR0FBRCxFQUFNZixHQUFOLEVBQVdELEdBQVgsRUFBZ0JJLFNBQWhCLEVBQThCO0FBQUE7QUFBQTtBQUFBLGFBQUlrRCxPQUFKLENBQWMsVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQUE7QUFDakYsUUFBTUMsRUFBRSwyQkFBR3JELFNBQVMsQ0FBQ0wsT0FBVixDQUFrQmlCLEdBQWxCLEVBQXVCZixHQUF2QixFQUE0QkQsR0FBNUIsQ0FBSCxDQUFSO0FBRGlGOztBQUVqRnlELE1BQUUsQ0FBQ0MsVUFBSCxHQUFnQixVQUFDQyxHQUFELEVBQVM7QUFBQTtBQUFBO0FBQUVKLGFBQU8sQ0FBQ0ksR0FBRyxDQUFDQyxNQUFKLENBQVdDLE1BQVosQ0FBUDtBQUE2QixLQUF4RDs7QUFGaUY7O0FBR2pGSixNQUFFLENBQUNLLE9BQUgsR0FBYSxZQUFNO0FBQUE7QUFBQTtBQUFFTixZQUFNLENBQUMsbUJBQUQsQ0FBTjtBQUE4QixLQUFuRDtBQUNELEdBSitDO0FBSTlDLENBSkY7Ozs7QUFLQSxJQUFNTixTQUFTLEdBQUcsU0FBWkEsU0FBWSxDQUFDbEMsR0FBRCxFQUFNZixHQUFOLEVBQVdTLElBQVgsRUFBaUJOLFNBQWpCLEVBQStCO0FBQUE7QUFBQTtBQUFBLGFBQUlrRCxPQUFKLENBQWMsVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQUE7QUFDbEYsUUFBTUMsRUFBRSwyQkFBR3JELFNBQVMsQ0FBQ1MsT0FBVixDQUFrQkcsR0FBbEIsRUFBdUJmLEdBQXZCLEVBQTRCUyxJQUE1QixDQUFILENBQVI7QUFEa0Y7O0FBRWxGK0MsTUFBRSxDQUFDQyxVQUFILEdBQWdCLFVBQUNDLEdBQUQsRUFBUztBQUFBO0FBQUE7QUFBRUosYUFBTyxDQUFDSSxHQUFHLENBQUNDLE1BQUosQ0FBV0MsTUFBWixDQUFQO0FBQTZCLEtBQXhEOztBQUZrRjs7QUFHbEZKLE1BQUUsQ0FBQ0ssT0FBSCxHQUFhLFlBQU07QUFBQTtBQUFBO0FBQUVOLFlBQU0sQ0FBQyxtQkFBRCxDQUFOO0FBQThCLEtBQW5EO0FBQ0QsR0FKZ0Q7QUFJL0MsQ0FKRixDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3RGQSxvRCIsImZpbGUiOiJqc2NhZXMuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKFwiY3J5cHRvXCIpKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtcImNyeXB0b1wiXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJqc2NhZXNcIl0gPSBmYWN0b3J5KHJlcXVpcmUoXCJjcnlwdG9cIikpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImpzY2Flc1wiXSA9IGZhY3Rvcnkocm9vdFtcImNyeXB0b1wiXSk7XG59KSh0aGlzLCBmdW5jdGlvbihfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX2NyeXB0b19fKSB7XG5yZXR1cm4gIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvVXNlcnMvanVuL1Byb2plY3RKYXZhU2NyaXB0L2pzX2NyeXB0b19hZXMvZGlzdFwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG4iLCJmdW5jdGlvbiBhc3luY0dlbmVyYXRvclN0ZXAoZ2VuLCByZXNvbHZlLCByZWplY3QsIF9uZXh0LCBfdGhyb3csIGtleSwgYXJnKSB7XG4gIHRyeSB7XG4gICAgdmFyIGluZm8gPSBnZW5ba2V5XShhcmcpO1xuICAgIHZhciB2YWx1ZSA9IGluZm8udmFsdWU7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmVqZWN0KGVycm9yKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoaW5mby5kb25lKSB7XG4gICAgcmVzb2x2ZSh2YWx1ZSk7XG4gIH0gZWxzZSB7XG4gICAgUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKF9uZXh0LCBfdGhyb3cpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9hc3luY1RvR2VuZXJhdG9yKGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgZ2VuID0gZm4uYXBwbHkoc2VsZiwgYXJncyk7XG5cbiAgICAgIGZ1bmN0aW9uIF9uZXh0KHZhbHVlKSB7XG4gICAgICAgIGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywgXCJuZXh0XCIsIHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gX3Rocm93KGVycikge1xuICAgICAgICBhc3luY0dlbmVyYXRvclN0ZXAoZ2VuLCByZXNvbHZlLCByZWplY3QsIF9uZXh0LCBfdGhyb3csIFwidGhyb3dcIiwgZXJyKTtcbiAgICAgIH1cblxuICAgICAgX25leHQodW5kZWZpbmVkKTtcbiAgICB9KTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfYXN5bmNUb0dlbmVyYXRvcjsiLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNC1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbi8vIFRoaXMgbWV0aG9kIG9mIG9idGFpbmluZyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdCBuZWVkcyB0byBiZVxuLy8ga2VwdCBpZGVudGljYWwgdG8gdGhlIHdheSBpdCBpcyBvYnRhaW5lZCBpbiBydW50aW1lLmpzXG52YXIgZyA9IChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMgfHwgKHR5cGVvZiBzZWxmID09PSBcIm9iamVjdFwiICYmIHNlbGYpO1xufSkoKSB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCk7XG5cbi8vIFVzZSBgZ2V0T3duUHJvcGVydHlOYW1lc2AgYmVjYXVzZSBub3QgYWxsIGJyb3dzZXJzIHN1cHBvcnQgY2FsbGluZ1xuLy8gYGhhc093blByb3BlcnR5YCBvbiB0aGUgZ2xvYmFsIGBzZWxmYCBvYmplY3QgaW4gYSB3b3JrZXIuIFNlZSAjMTgzLlxudmFyIGhhZFJ1bnRpbWUgPSBnLnJlZ2VuZXJhdG9yUnVudGltZSAmJlxuICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhnKS5pbmRleE9mKFwicmVnZW5lcmF0b3JSdW50aW1lXCIpID49IDA7XG5cbi8vIFNhdmUgdGhlIG9sZCByZWdlbmVyYXRvclJ1bnRpbWUgaW4gY2FzZSBpdCBuZWVkcyB0byBiZSByZXN0b3JlZCBsYXRlci5cbnZhciBvbGRSdW50aW1lID0gaGFkUnVudGltZSAmJiBnLnJlZ2VuZXJhdG9yUnVudGltZTtcblxuLy8gRm9yY2UgcmVldmFsdXRhdGlvbiBvZiBydW50aW1lLmpzLlxuZy5yZWdlbmVyYXRvclJ1bnRpbWUgPSB1bmRlZmluZWQ7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vcnVudGltZVwiKTtcblxuaWYgKGhhZFJ1bnRpbWUpIHtcbiAgLy8gUmVzdG9yZSB0aGUgb3JpZ2luYWwgcnVudGltZS5cbiAgZy5yZWdlbmVyYXRvclJ1bnRpbWUgPSBvbGRSdW50aW1lO1xufSBlbHNlIHtcbiAgLy8gUmVtb3ZlIHRoZSBnbG9iYWwgcHJvcGVydHkgYWRkZWQgYnkgcnVudGltZS5qcy5cbiAgdHJ5IHtcbiAgICBkZWxldGUgZy5yZWdlbmVyYXRvclJ1bnRpbWU7XG4gIH0gY2F0Y2goZSkge1xuICAgIGcucmVnZW5lcmF0b3JSdW50aW1lID0gdW5kZWZpbmVkO1xuICB9XG59XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNC1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbiEoZnVuY3Rpb24oZ2xvYmFsKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciBPcCA9IE9iamVjdC5wcm90b3R5cGU7XG4gIHZhciBoYXNPd24gPSBPcC5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyIHVuZGVmaW5lZDsgLy8gTW9yZSBjb21wcmVzc2libGUgdGhhbiB2b2lkIDAuXG4gIHZhciAkU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sIDoge307XG4gIHZhciBpdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuaXRlcmF0b3IgfHwgXCJAQGl0ZXJhdG9yXCI7XG4gIHZhciBhc3luY0l0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5hc3luY0l0ZXJhdG9yIHx8IFwiQEBhc3luY0l0ZXJhdG9yXCI7XG4gIHZhciB0b1N0cmluZ1RhZ1N5bWJvbCA9ICRTeW1ib2wudG9TdHJpbmdUYWcgfHwgXCJAQHRvU3RyaW5nVGFnXCI7XG5cbiAgdmFyIGluTW9kdWxlID0gdHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIjtcbiAgdmFyIHJ1bnRpbWUgPSBnbG9iYWwucmVnZW5lcmF0b3JSdW50aW1lO1xuICBpZiAocnVudGltZSkge1xuICAgIGlmIChpbk1vZHVsZSkge1xuICAgICAgLy8gSWYgcmVnZW5lcmF0b3JSdW50aW1lIGlzIGRlZmluZWQgZ2xvYmFsbHkgYW5kIHdlJ3JlIGluIGEgbW9kdWxlLFxuICAgICAgLy8gbWFrZSB0aGUgZXhwb3J0cyBvYmplY3QgaWRlbnRpY2FsIHRvIHJlZ2VuZXJhdG9yUnVudGltZS5cbiAgICAgIG1vZHVsZS5leHBvcnRzID0gcnVudGltZTtcbiAgICB9XG4gICAgLy8gRG9uJ3QgYm90aGVyIGV2YWx1YXRpbmcgdGhlIHJlc3Qgb2YgdGhpcyBmaWxlIGlmIHRoZSBydW50aW1lIHdhc1xuICAgIC8vIGFscmVhZHkgZGVmaW5lZCBnbG9iYWxseS5cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBEZWZpbmUgdGhlIHJ1bnRpbWUgZ2xvYmFsbHkgKGFzIGV4cGVjdGVkIGJ5IGdlbmVyYXRlZCBjb2RlKSBhcyBlaXRoZXJcbiAgLy8gbW9kdWxlLmV4cG9ydHMgKGlmIHdlJ3JlIGluIGEgbW9kdWxlKSBvciBhIG5ldywgZW1wdHkgb2JqZWN0LlxuICBydW50aW1lID0gZ2xvYmFsLnJlZ2VuZXJhdG9yUnVudGltZSA9IGluTW9kdWxlID8gbW9kdWxlLmV4cG9ydHMgOiB7fTtcblxuICBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gSWYgb3V0ZXJGbiBwcm92aWRlZCBhbmQgb3V0ZXJGbi5wcm90b3R5cGUgaXMgYSBHZW5lcmF0b3IsIHRoZW4gb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IuXG4gICAgdmFyIHByb3RvR2VuZXJhdG9yID0gb3V0ZXJGbiAmJiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvciA/IG91dGVyRm4gOiBHZW5lcmF0b3I7XG4gICAgdmFyIGdlbmVyYXRvciA9IE9iamVjdC5jcmVhdGUocHJvdG9HZW5lcmF0b3IucHJvdG90eXBlKTtcbiAgICB2YXIgY29udGV4dCA9IG5ldyBDb250ZXh0KHRyeUxvY3NMaXN0IHx8IFtdKTtcblxuICAgIC8vIFRoZSAuX2ludm9rZSBtZXRob2QgdW5pZmllcyB0aGUgaW1wbGVtZW50YXRpb25zIG9mIHRoZSAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMuXG4gICAgZ2VuZXJhdG9yLl9pbnZva2UgPSBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuXG4gICAgcmV0dXJuIGdlbmVyYXRvcjtcbiAgfVxuICBydW50aW1lLndyYXAgPSB3cmFwO1xuXG4gIC8vIFRyeS9jYXRjaCBoZWxwZXIgdG8gbWluaW1pemUgZGVvcHRpbWl6YXRpb25zLiBSZXR1cm5zIGEgY29tcGxldGlvblxuICAvLyByZWNvcmQgbGlrZSBjb250ZXh0LnRyeUVudHJpZXNbaV0uY29tcGxldGlvbi4gVGhpcyBpbnRlcmZhY2UgY291bGRcbiAgLy8gaGF2ZSBiZWVuIChhbmQgd2FzIHByZXZpb3VzbHkpIGRlc2lnbmVkIHRvIHRha2UgYSBjbG9zdXJlIHRvIGJlXG4gIC8vIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGJ1dCBpbiBhbGwgdGhlIGNhc2VzIHdlIGNhcmUgYWJvdXQgd2VcbiAgLy8gYWxyZWFkeSBoYXZlIGFuIGV4aXN0aW5nIG1ldGhvZCB3ZSB3YW50IHRvIGNhbGwsIHNvIHRoZXJlJ3Mgbm8gbmVlZFxuICAvLyB0byBjcmVhdGUgYSBuZXcgZnVuY3Rpb24gb2JqZWN0LiBXZSBjYW4gZXZlbiBnZXQgYXdheSB3aXRoIGFzc3VtaW5nXG4gIC8vIHRoZSBtZXRob2QgdGFrZXMgZXhhY3RseSBvbmUgYXJndW1lbnQsIHNpbmNlIHRoYXQgaGFwcGVucyB0byBiZSB0cnVlXG4gIC8vIGluIGV2ZXJ5IGNhc2UsIHNvIHdlIGRvbid0IGhhdmUgdG8gdG91Y2ggdGhlIGFyZ3VtZW50cyBvYmplY3QuIFRoZVxuICAvLyBvbmx5IGFkZGl0aW9uYWwgYWxsb2NhdGlvbiByZXF1aXJlZCBpcyB0aGUgY29tcGxldGlvbiByZWNvcmQsIHdoaWNoXG4gIC8vIGhhcyBhIHN0YWJsZSBzaGFwZSBhbmQgc28gaG9wZWZ1bGx5IHNob3VsZCBiZSBjaGVhcCB0byBhbGxvY2F0ZS5cbiAgZnVuY3Rpb24gdHJ5Q2F0Y2goZm4sIG9iaiwgYXJnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwibm9ybWFsXCIsIGFyZzogZm4uY2FsbChvYmosIGFyZykgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwidGhyb3dcIiwgYXJnOiBlcnIgfTtcbiAgICB9XG4gIH1cblxuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRTdGFydCA9IFwic3VzcGVuZGVkU3RhcnRcIjtcbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkWWllbGQgPSBcInN1c3BlbmRlZFlpZWxkXCI7XG4gIHZhciBHZW5TdGF0ZUV4ZWN1dGluZyA9IFwiZXhlY3V0aW5nXCI7XG4gIHZhciBHZW5TdGF0ZUNvbXBsZXRlZCA9IFwiY29tcGxldGVkXCI7XG5cbiAgLy8gUmV0dXJuaW5nIHRoaXMgb2JqZWN0IGZyb20gdGhlIGlubmVyRm4gaGFzIHRoZSBzYW1lIGVmZmVjdCBhc1xuICAvLyBicmVha2luZyBvdXQgb2YgdGhlIGRpc3BhdGNoIHN3aXRjaCBzdGF0ZW1lbnQuXG4gIHZhciBDb250aW51ZVNlbnRpbmVsID0ge307XG5cbiAgLy8gRHVtbXkgY29uc3RydWN0b3IgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIGFzIHRoZSAuY29uc3RydWN0b3IgYW5kXG4gIC8vIC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgcHJvcGVydGllcyBmb3IgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIEdlbmVyYXRvclxuICAvLyBvYmplY3RzLiBGb3IgZnVsbCBzcGVjIGNvbXBsaWFuY2UsIHlvdSBtYXkgd2lzaCB0byBjb25maWd1cmUgeW91clxuICAvLyBtaW5pZmllciBub3QgdG8gbWFuZ2xlIHRoZSBuYW1lcyBvZiB0aGVzZSB0d28gZnVuY3Rpb25zLlxuICBmdW5jdGlvbiBHZW5lcmF0b3IoKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge31cblxuICAvLyBUaGlzIGlzIGEgcG9seWZpbGwgZm9yICVJdGVyYXRvclByb3RvdHlwZSUgZm9yIGVudmlyb25tZW50cyB0aGF0XG4gIC8vIGRvbid0IG5hdGl2ZWx5IHN1cHBvcnQgaXQuXG4gIHZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuICBJdGVyYXRvclByb3RvdHlwZVtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgdmFyIGdldFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuICB2YXIgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90byAmJiBnZXRQcm90byhnZXRQcm90byh2YWx1ZXMoW10pKSk7XG4gIGlmIChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAmJlxuICAgICAgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgIT09IE9wICYmXG4gICAgICBoYXNPd24uY2FsbChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSwgaXRlcmF0b3JTeW1ib2wpKSB7XG4gICAgLy8gVGhpcyBlbnZpcm9ubWVudCBoYXMgYSBuYXRpdmUgJUl0ZXJhdG9yUHJvdG90eXBlJTsgdXNlIGl0IGluc3RlYWRcbiAgICAvLyBvZiB0aGUgcG9seWZpbGwuXG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBOYXRpdmVJdGVyYXRvclByb3RvdHlwZTtcbiAgfVxuXG4gIHZhciBHcCA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLnByb3RvdHlwZSA9XG4gICAgR2VuZXJhdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUpO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5wcm90b3R5cGUgPSBHcC5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZVt0b1N0cmluZ1RhZ1N5bWJvbF0gPVxuICAgIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuXG4gIC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG4gIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuXG4gIGZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhwcm90b3R5cGUpIHtcbiAgICBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgIHByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZva2UobWV0aG9kLCBhcmcpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIHJ1bnRpbWUuaXNHZW5lcmF0b3JGdW5jdGlvbiA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIHZhciBjdG9yID0gdHlwZW9mIGdlbkZ1biA9PT0gXCJmdW5jdGlvblwiICYmIGdlbkZ1bi5jb25zdHJ1Y3RvcjtcbiAgICByZXR1cm4gY3RvclxuICAgICAgPyBjdG9yID09PSBHZW5lcmF0b3JGdW5jdGlvbiB8fFxuICAgICAgICAvLyBGb3IgdGhlIG5hdGl2ZSBHZW5lcmF0b3JGdW5jdGlvbiBjb25zdHJ1Y3RvciwgdGhlIGJlc3Qgd2UgY2FuXG4gICAgICAgIC8vIGRvIGlzIHRvIGNoZWNrIGl0cyAubmFtZSBwcm9wZXJ0eS5cbiAgICAgICAgKGN0b3IuZGlzcGxheU5hbWUgfHwgY3Rvci5uYW1lKSA9PT0gXCJHZW5lcmF0b3JGdW5jdGlvblwiXG4gICAgICA6IGZhbHNlO1xuICB9O1xuXG4gIHJ1bnRpbWUubWFyayA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIGlmIChPYmplY3Quc2V0UHJvdG90eXBlT2YpIHtcbiAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihnZW5GdW4sIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2VuRnVuLl9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICAgICAgaWYgKCEodG9TdHJpbmdUYWdTeW1ib2wgaW4gZ2VuRnVuKSkge1xuICAgICAgICBnZW5GdW5bdG9TdHJpbmdUYWdTeW1ib2xdID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuICAgICAgfVxuICAgIH1cbiAgICBnZW5GdW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHcCk7XG4gICAgcmV0dXJuIGdlbkZ1bjtcbiAgfTtcblxuICAvLyBXaXRoaW4gdGhlIGJvZHkgb2YgYW55IGFzeW5jIGZ1bmN0aW9uLCBgYXdhaXQgeGAgaXMgdHJhbnNmb3JtZWQgdG9cbiAgLy8gYHlpZWxkIHJlZ2VuZXJhdG9yUnVudGltZS5hd3JhcCh4KWAsIHNvIHRoYXQgdGhlIHJ1bnRpbWUgY2FuIHRlc3RcbiAgLy8gYGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIilgIHRvIGRldGVybWluZSBpZiB0aGUgeWllbGRlZCB2YWx1ZSBpc1xuICAvLyBtZWFudCB0byBiZSBhd2FpdGVkLlxuICBydW50aW1lLmF3cmFwID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHsgX19hd2FpdDogYXJnIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gQXN5bmNJdGVyYXRvcihnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGdlbmVyYXRvclttZXRob2RdLCBnZW5lcmF0b3IsIGFyZyk7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICByZWplY3QocmVjb3JkLmFyZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVzdWx0ID0gcmVjb3JkLmFyZztcbiAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgJiZcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUuX19hd2FpdCkudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaW52b2tlKFwibmV4dFwiLCB2YWx1ZSwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIGludm9rZShcInRocm93XCIsIGVyciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4oZnVuY3Rpb24odW53cmFwcGVkKSB7XG4gICAgICAgICAgLy8gV2hlbiBhIHlpZWxkZWQgUHJvbWlzZSBpcyByZXNvbHZlZCwgaXRzIGZpbmFsIHZhbHVlIGJlY29tZXNcbiAgICAgICAgICAvLyB0aGUgLnZhbHVlIG9mIHRoZSBQcm9taXNlPHt2YWx1ZSxkb25lfT4gcmVzdWx0IGZvciB0aGVcbiAgICAgICAgICAvLyBjdXJyZW50IGl0ZXJhdGlvbi5cbiAgICAgICAgICByZXN1bHQudmFsdWUgPSB1bndyYXBwZWQ7XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgIC8vIElmIGEgcmVqZWN0ZWQgUHJvbWlzZSB3YXMgeWllbGRlZCwgdGhyb3cgdGhlIHJlamVjdGlvbiBiYWNrXG4gICAgICAgICAgLy8gaW50byB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIHNvIGl0IGNhbiBiZSBoYW5kbGVkIHRoZXJlLlxuICAgICAgICAgIHJldHVybiBpbnZva2UoXCJ0aHJvd1wiLCBlcnJvciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHByZXZpb3VzUHJvbWlzZTtcblxuICAgIGZ1bmN0aW9uIGVucXVldWUobWV0aG9kLCBhcmcpIHtcbiAgICAgIGZ1bmN0aW9uIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByZXZpb3VzUHJvbWlzZSA9XG4gICAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcbiAgICAgICAgLy8gYWxsIHByZXZpb3VzIFByb21pc2VzIGhhdmUgYmVlbiByZXNvbHZlZCBiZWZvcmUgY2FsbGluZyBpbnZva2UsXG4gICAgICAgIC8vIHNvIHRoYXQgcmVzdWx0cyBhcmUgYWx3YXlzIGRlbGl2ZXJlZCBpbiB0aGUgY29ycmVjdCBvcmRlci4gSWZcbiAgICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cbiAgICAgICAgLy8gY2FsbCBpbnZva2UgaW1tZWRpYXRlbHksIHdpdGhvdXQgd2FpdGluZyBvbiBhIGNhbGxiYWNrIHRvIGZpcmUsXG4gICAgICAgIC8vIHNvIHRoYXQgdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBoYXMgdGhlIG9wcG9ydHVuaXR5IHRvIGRvXG4gICAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcbiAgICAgICAgLy8gaXMgd2h5IHRoZSBQcm9taXNlIGNvbnN0cnVjdG9yIHN5bmNocm9ub3VzbHkgaW52b2tlcyBpdHNcbiAgICAgICAgLy8gZXhlY3V0b3IgY2FsbGJhY2ssIGFuZCB3aHkgYXN5bmMgZnVuY3Rpb25zIHN5bmNocm9ub3VzbHlcbiAgICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcbiAgICAgICAgLy8gYXN5bmMgZnVuY3Rpb25zIGluIHRlcm1zIG9mIGFzeW5jIGdlbmVyYXRvcnMsIGl0IGlzIGVzcGVjaWFsbHlcbiAgICAgICAgLy8gaW1wb3J0YW50IHRvIGdldCB0aGlzIHJpZ2h0LCBldmVuIHRob3VnaCBpdCByZXF1aXJlcyBjYXJlLlxuICAgICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihcbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyxcbiAgICAgICAgICAvLyBBdm9pZCBwcm9wYWdhdGluZyBmYWlsdXJlcyB0byBQcm9taXNlcyByZXR1cm5lZCBieSBsYXRlclxuICAgICAgICAgIC8vIGludm9jYXRpb25zIG9mIHRoZSBpdGVyYXRvci5cbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZ1xuICAgICAgICApIDogY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKTtcbiAgICB9XG5cbiAgICAvLyBEZWZpbmUgdGhlIHVuaWZpZWQgaGVscGVyIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gaW1wbGVtZW50IC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gKHNlZSBkZWZpbmVJdGVyYXRvck1ldGhvZHMpLlxuICAgIHRoaXMuX2ludm9rZSA9IGVucXVldWU7XG4gIH1cblxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoQXN5bmNJdGVyYXRvci5wcm90b3R5cGUpO1xuICBBc3luY0l0ZXJhdG9yLnByb3RvdHlwZVthc3luY0l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgcnVudGltZS5Bc3luY0l0ZXJhdG9yID0gQXN5bmNJdGVyYXRvcjtcblxuICAvLyBOb3RlIHRoYXQgc2ltcGxlIGFzeW5jIGZ1bmN0aW9ucyBhcmUgaW1wbGVtZW50ZWQgb24gdG9wIG9mXG4gIC8vIEFzeW5jSXRlcmF0b3Igb2JqZWN0czsgdGhleSBqdXN0IHJldHVybiBhIFByb21pc2UgZm9yIHRoZSB2YWx1ZSBvZlxuICAvLyB0aGUgZmluYWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHRoZSBpdGVyYXRvci5cbiAgcnVudGltZS5hc3luYyA9IGZ1bmN0aW9uKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgdmFyIGl0ZXIgPSBuZXcgQXN5bmNJdGVyYXRvcihcbiAgICAgIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpXG4gICAgKTtcblxuICAgIHJldHVybiBydW50aW1lLmlzR2VuZXJhdG9yRnVuY3Rpb24ob3V0ZXJGbilcbiAgICAgID8gaXRlciAvLyBJZiBvdXRlckZuIGlzIGEgZ2VuZXJhdG9yLCByZXR1cm4gdGhlIGZ1bGwgaXRlcmF0b3IuXG4gICAgICA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7XG4gICAgICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCkge1xuICAgIHZhciBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQ7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlRXhlY3V0aW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVDb21wbGV0ZWQpIHtcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmUgZm9yZ2l2aW5nLCBwZXIgMjUuMy4zLjMuMyBvZiB0aGUgc3BlYzpcbiAgICAgICAgLy8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWdlbmVyYXRvcnJlc3VtZVxuICAgICAgICByZXR1cm4gZG9uZVJlc3VsdCgpO1xuICAgICAgfVxuXG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgIGNvbnRleHQuYXJnID0gYXJnO1xuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgZGVsZWdhdGUgPSBjb250ZXh0LmRlbGVnYXRlO1xuICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICB2YXIgZGVsZWdhdGVSZXN1bHQgPSBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcbiAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCA9PT0gQ29udGludWVTZW50aW5lbCkgY29udGludWU7XG4gICAgICAgICAgICByZXR1cm4gZGVsZWdhdGVSZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgIC8vIFNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICAgICAgY29udGV4dC5zZW50ID0gY29udGV4dC5fc2VudCA9IGNvbnRleHQuYXJnO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydCkge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAgIHRocm93IGNvbnRleHQuYXJnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBjb250ZXh0LmFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG4gICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cbiAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZVxuICAgICAgICAgICAgPyBHZW5TdGF0ZUNvbXBsZXRlZFxuICAgICAgICAgICAgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmFyZyxcbiAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlXG4gICAgICAgICAgLy8gY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZykgY2FsbCBhYm92ZS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gQ2FsbCBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF0oY29udGV4dC5hcmcpIGFuZCBoYW5kbGUgdGhlXG4gIC8vIHJlc3VsdCwgZWl0aGVyIGJ5IHJldHVybmluZyBhIHsgdmFsdWUsIGRvbmUgfSByZXN1bHQgZnJvbSB0aGVcbiAgLy8gZGVsZWdhdGUgaXRlcmF0b3IsIG9yIGJ5IG1vZGlmeWluZyBjb250ZXh0Lm1ldGhvZCBhbmQgY29udGV4dC5hcmcsXG4gIC8vIHNldHRpbmcgY29udGV4dC5kZWxlZ2F0ZSB0byBudWxsLCBhbmQgcmV0dXJuaW5nIHRoZSBDb250aW51ZVNlbnRpbmVsLlxuICBmdW5jdGlvbiBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIG1ldGhvZCA9IGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXTtcbiAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEEgLnRocm93IG9yIC5yZXR1cm4gd2hlbiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIG5vIC50aHJvd1xuICAgICAgLy8gbWV0aG9kIGFsd2F5cyB0ZXJtaW5hdGVzIHRoZSB5aWVsZCogbG9vcC5cbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICBpZiAoZGVsZWdhdGUuaXRlcmF0b3IucmV0dXJuKSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBhIHJldHVybiBtZXRob2QsIGdpdmUgaXQgYVxuICAgICAgICAgIC8vIGNoYW5jZSB0byBjbGVhbiB1cC5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG5cbiAgICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgLy8gSWYgbWF5YmVJbnZva2VEZWxlZ2F0ZShjb250ZXh0KSBjaGFuZ2VkIGNvbnRleHQubWV0aG9kIGZyb21cbiAgICAgICAgICAgIC8vIFwicmV0dXJuXCIgdG8gXCJ0aHJvd1wiLCBsZXQgdGhhdCBvdmVycmlkZSB0aGUgVHlwZUVycm9yIGJlbG93LlxuICAgICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICBcIlRoZSBpdGVyYXRvciBkb2VzIG5vdCBwcm92aWRlIGEgJ3Rocm93JyBtZXRob2RcIik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChtZXRob2QsIGRlbGVnYXRlLml0ZXJhdG9yLCBjb250ZXh0LmFyZyk7XG5cbiAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciBpbmZvID0gcmVjb3JkLmFyZztcblxuICAgIGlmICghIGluZm8pIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFwiaXRlcmF0b3IgcmVzdWx0IGlzIG5vdCBhbiBvYmplY3RcIik7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIGlmIChpbmZvLmRvbmUpIHtcbiAgICAgIC8vIEFzc2lnbiB0aGUgcmVzdWx0IG9mIHRoZSBmaW5pc2hlZCBkZWxlZ2F0ZSB0byB0aGUgdGVtcG9yYXJ5XG4gICAgICAvLyB2YXJpYWJsZSBzcGVjaWZpZWQgYnkgZGVsZWdhdGUucmVzdWx0TmFtZSAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dFtkZWxlZ2F0ZS5yZXN1bHROYW1lXSA9IGluZm8udmFsdWU7XG5cbiAgICAgIC8vIFJlc3VtZSBleGVjdXRpb24gYXQgdGhlIGRlc2lyZWQgbG9jYXRpb24gKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHQubmV4dCA9IGRlbGVnYXRlLm5leHRMb2M7XG5cbiAgICAgIC8vIElmIGNvbnRleHQubWV0aG9kIHdhcyBcInRocm93XCIgYnV0IHRoZSBkZWxlZ2F0ZSBoYW5kbGVkIHRoZVxuICAgICAgLy8gZXhjZXB0aW9uLCBsZXQgdGhlIG91dGVyIGdlbmVyYXRvciBwcm9jZWVkIG5vcm1hbGx5LiBJZlxuICAgICAgLy8gY29udGV4dC5tZXRob2Qgd2FzIFwibmV4dFwiLCBmb3JnZXQgY29udGV4dC5hcmcgc2luY2UgaXQgaGFzIGJlZW5cbiAgICAgIC8vIFwiY29uc3VtZWRcIiBieSB0aGUgZGVsZWdhdGUgaXRlcmF0b3IuIElmIGNvbnRleHQubWV0aG9kIHdhc1xuICAgICAgLy8gXCJyZXR1cm5cIiwgYWxsb3cgdGhlIG9yaWdpbmFsIC5yZXR1cm4gY2FsbCB0byBjb250aW51ZSBpbiB0aGVcbiAgICAgIC8vIG91dGVyIGdlbmVyYXRvci5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCAhPT0gXCJyZXR1cm5cIikge1xuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZS15aWVsZCB0aGUgcmVzdWx0IHJldHVybmVkIGJ5IHRoZSBkZWxlZ2F0ZSBtZXRob2QuXG4gICAgICByZXR1cm4gaW5mbztcbiAgICB9XG5cbiAgICAvLyBUaGUgZGVsZWdhdGUgaXRlcmF0b3IgaXMgZmluaXNoZWQsIHNvIGZvcmdldCBpdCBhbmQgY29udGludWUgd2l0aFxuICAgIC8vIHRoZSBvdXRlciBnZW5lcmF0b3IuXG4gICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gIH1cblxuICAvLyBEZWZpbmUgR2VuZXJhdG9yLnByb3RvdHlwZS57bmV4dCx0aHJvdyxyZXR1cm59IGluIHRlcm1zIG9mIHRoZVxuICAvLyB1bmlmaWVkIC5faW52b2tlIGhlbHBlciBtZXRob2QuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhHcCk7XG5cbiAgR3BbdG9TdHJpbmdUYWdTeW1ib2xdID0gXCJHZW5lcmF0b3JcIjtcblxuICAvLyBBIEdlbmVyYXRvciBzaG91bGQgYWx3YXlzIHJldHVybiBpdHNlbGYgYXMgdGhlIGl0ZXJhdG9yIG9iamVjdCB3aGVuIHRoZVxuICAvLyBAQGl0ZXJhdG9yIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiBpdC4gU29tZSBicm93c2VycycgaW1wbGVtZW50YXRpb25zIG9mIHRoZVxuICAvLyBpdGVyYXRvciBwcm90b3R5cGUgY2hhaW4gaW5jb3JyZWN0bHkgaW1wbGVtZW50IHRoaXMsIGNhdXNpbmcgdGhlIEdlbmVyYXRvclxuICAvLyBvYmplY3QgdG8gbm90IGJlIHJldHVybmVkIGZyb20gdGhpcyBjYWxsLiBUaGlzIGVuc3VyZXMgdGhhdCBkb2Vzbid0IGhhcHBlbi5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9pc3N1ZXMvMjc0IGZvciBtb3JlIGRldGFpbHMuXG4gIEdwW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEdwLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7XG4gIH07XG5cbiAgZnVuY3Rpb24gcHVzaFRyeUVudHJ5KGxvY3MpIHtcbiAgICB2YXIgZW50cnkgPSB7IHRyeUxvYzogbG9jc1swXSB9O1xuXG4gICAgaWYgKDEgaW4gbG9jcykge1xuICAgICAgZW50cnkuY2F0Y2hMb2MgPSBsb2NzWzFdO1xuICAgIH1cblxuICAgIGlmICgyIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdO1xuICAgICAgZW50cnkuYWZ0ZXJMb2MgPSBsb2NzWzNdO1xuICAgIH1cblxuICAgIHRoaXMudHJ5RW50cmllcy5wdXNoKGVudHJ5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0VHJ5RW50cnkoZW50cnkpIHtcbiAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbiB8fCB7fTtcbiAgICByZWNvcmQudHlwZSA9IFwibm9ybWFsXCI7XG4gICAgZGVsZXRlIHJlY29yZC5hcmc7XG4gICAgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbnRleHQodHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBUaGUgcm9vdCBlbnRyeSBvYmplY3QgKGVmZmVjdGl2ZWx5IGEgdHJ5IHN0YXRlbWVudCB3aXRob3V0IGEgY2F0Y2hcbiAgICAvLyBvciBhIGZpbmFsbHkgYmxvY2spIGdpdmVzIHVzIGEgcGxhY2UgdG8gc3RvcmUgdmFsdWVzIHRocm93biBmcm9tXG4gICAgLy8gbG9jYXRpb25zIHdoZXJlIHRoZXJlIGlzIG5vIGVuY2xvc2luZyB0cnkgc3RhdGVtZW50LlxuICAgIHRoaXMudHJ5RW50cmllcyA9IFt7IHRyeUxvYzogXCJyb290XCIgfV07XG4gICAgdHJ5TG9jc0xpc3QuZm9yRWFjaChwdXNoVHJ5RW50cnksIHRoaXMpO1xuICAgIHRoaXMucmVzZXQodHJ1ZSk7XG4gIH1cblxuICBydW50aW1lLmtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH1cbiAgICBrZXlzLnJldmVyc2UoKTtcblxuICAgIC8vIFJhdGhlciB0aGFuIHJldHVybmluZyBhbiBvYmplY3Qgd2l0aCBhIG5leHQgbWV0aG9kLCB3ZSBrZWVwXG4gICAgLy8gdGhpbmdzIHNpbXBsZSBhbmQgcmV0dXJuIHRoZSBuZXh0IGZ1bmN0aW9uIGl0c2VsZi5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIHdoaWxlIChrZXlzLmxlbmd0aCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5cy5wb3AoKTtcbiAgICAgICAgaWYgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICBuZXh0LnZhbHVlID0ga2V5O1xuICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRvIGF2b2lkIGNyZWF0aW5nIGFuIGFkZGl0aW9uYWwgb2JqZWN0LCB3ZSBqdXN0IGhhbmcgdGhlIC52YWx1ZVxuICAgICAgLy8gYW5kIC5kb25lIHByb3BlcnRpZXMgb2ZmIHRoZSBuZXh0IGZ1bmN0aW9uIG9iamVjdCBpdHNlbGYuIFRoaXNcbiAgICAgIC8vIGFsc28gZW5zdXJlcyB0aGF0IHRoZSBtaW5pZmllciB3aWxsIG5vdCBhbm9ueW1pemUgdGhlIGZ1bmN0aW9uLlxuICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gdmFsdWVzKGl0ZXJhYmxlKSB7XG4gICAgaWYgKGl0ZXJhYmxlKSB7XG4gICAgICB2YXIgaXRlcmF0b3JNZXRob2QgPSBpdGVyYWJsZVtpdGVyYXRvclN5bWJvbF07XG4gICAgICBpZiAoaXRlcmF0b3JNZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yTWV0aG9kLmNhbGwoaXRlcmFibGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGl0ZXJhYmxlLm5leHQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gaXRlcmFibGU7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4oaXRlcmFibGUubGVuZ3RoKSkge1xuICAgICAgICB2YXIgaSA9IC0xLCBuZXh0ID0gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgaXRlcmFibGUubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwoaXRlcmFibGUsIGkpKSB7XG4gICAgICAgICAgICAgIG5leHQudmFsdWUgPSBpdGVyYWJsZVtpXTtcbiAgICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5leHQudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXh0Lm5leHQgPSBuZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBpdGVyYXRvciB3aXRoIG5vIHZhbHVlcy5cbiAgICByZXR1cm4geyBuZXh0OiBkb25lUmVzdWx0IH07XG4gIH1cbiAgcnVudGltZS52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgZnVuY3Rpb24gZG9uZVJlc3VsdCgpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIH1cblxuICBDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogQ29udGV4dCxcblxuICAgIHJlc2V0OiBmdW5jdGlvbihza2lwVGVtcFJlc2V0KSB7XG4gICAgICB0aGlzLnByZXYgPSAwO1xuICAgICAgdGhpcy5uZXh0ID0gMDtcbiAgICAgIC8vIFJlc2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgdGhpcy5zZW50ID0gdGhpcy5fc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcblxuICAgICAgdGhpcy50cnlFbnRyaWVzLmZvckVhY2gocmVzZXRUcnlFbnRyeSk7XG5cbiAgICAgIGlmICghc2tpcFRlbXBSZXNldCkge1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMpIHtcbiAgICAgICAgICAvLyBOb3Qgc3VyZSBhYm91dCB0aGUgb3B0aW1hbCBvcmRlciBvZiB0aGVzZSBjb25kaXRpb25zOlxuICAgICAgICAgIGlmIChuYW1lLmNoYXJBdCgwKSA9PT0gXCJ0XCIgJiZcbiAgICAgICAgICAgICAgaGFzT3duLmNhbGwodGhpcywgbmFtZSkgJiZcbiAgICAgICAgICAgICAgIWlzTmFOKCtuYW1lLnNsaWNlKDEpKSkge1xuICAgICAgICAgICAgdGhpc1tuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuXG4gICAgICB2YXIgcm9vdEVudHJ5ID0gdGhpcy50cnlFbnRyaWVzWzBdO1xuICAgICAgdmFyIHJvb3RSZWNvcmQgPSByb290RW50cnkuY29tcGxldGlvbjtcbiAgICAgIGlmIChyb290UmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucnZhbDtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2hFeGNlcHRpb246IGZ1bmN0aW9uKGV4Y2VwdGlvbikge1xuICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICB0aHJvdyBleGNlcHRpb247XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkge1xuICAgICAgICByZWNvcmQudHlwZSA9IFwidGhyb3dcIjtcbiAgICAgICAgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbjtcbiAgICAgICAgY29udGV4dC5uZXh0ID0gbG9jO1xuXG4gICAgICAgIGlmIChjYXVnaHQpIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGlzcGF0Y2hlZCBleGNlcHRpb24gd2FzIGNhdWdodCBieSBhIGNhdGNoIGJsb2NrLFxuICAgICAgICAgIC8vIHRoZW4gbGV0IHRoYXQgY2F0Y2ggYmxvY2sgaGFuZGxlIHRoZSBleGNlcHRpb24gbm9ybWFsbHkuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAhISBjYXVnaHQ7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSBcInJvb3RcIikge1xuICAgICAgICAgIC8vIEV4Y2VwdGlvbiB0aHJvd24gb3V0c2lkZSBvZiBhbnkgdHJ5IGJsb2NrIHRoYXQgY291bGQgaGFuZGxlXG4gICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvXG4gICAgICAgICAgLy8gdGhyb3cgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXR1cm4gaGFuZGxlKFwiZW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYpIHtcbiAgICAgICAgICB2YXIgaGFzQ2F0Y2ggPSBoYXNPd24uY2FsbChlbnRyeSwgXCJjYXRjaExvY1wiKTtcbiAgICAgICAgICB2YXIgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7XG5cbiAgICAgICAgICBpZiAoaGFzQ2F0Y2ggJiYgaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0NhdGNoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJ5IHN0YXRlbWVudCB3aXRob3V0IGNhdGNoIG9yIGZpbmFsbHlcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFicnVwdDogZnVuY3Rpb24odHlwZSwgYXJnKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIikgJiZcbiAgICAgICAgICAgIHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB2YXIgZmluYWxseUVudHJ5ID0gZW50cnk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSAmJlxuICAgICAgICAgICh0eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICAgdHlwZSA9PT0gXCJjb250aW51ZVwiKSAmJlxuICAgICAgICAgIGZpbmFsbHlFbnRyeS50cnlMb2MgPD0gYXJnICYmXG4gICAgICAgICAgYXJnIDw9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgIC8vIElnbm9yZSB0aGUgZmluYWxseSBlbnRyeSBpZiBjb250cm9sIGlzIG5vdCBqdW1waW5nIHRvIGFcbiAgICAgICAgLy8gbG9jYXRpb24gb3V0c2lkZSB0aGUgdHJ5L2NhdGNoIGJsb2NrLlxuICAgICAgICBmaW5hbGx5RW50cnkgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVjb3JkID0gZmluYWxseUVudHJ5ID8gZmluYWxseUVudHJ5LmNvbXBsZXRpb24gOiB7fTtcbiAgICAgIHJlY29yZC50eXBlID0gdHlwZTtcbiAgICAgIHJlY29yZC5hcmcgPSBhcmc7XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkpIHtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2M7XG4gICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5jb21wbGV0ZShyZWNvcmQpO1xuICAgIH0sXG5cbiAgICBjb21wbGV0ZTogZnVuY3Rpb24ocmVjb3JkLCBhZnRlckxvYykge1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IHJlY29yZC5hcmc7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInJldHVyblwiKSB7XG4gICAgICAgIHRoaXMucnZhbCA9IHRoaXMuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICB0aGlzLm5leHQgPSBcImVuZFwiO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIiAmJiBhZnRlckxvYykge1xuICAgICAgICB0aGlzLm5leHQgPSBhZnRlckxvYztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfSxcblxuICAgIGZpbmlzaDogZnVuY3Rpb24oZmluYWxseUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS5maW5hbGx5TG9jID09PSBmaW5hbGx5TG9jKSB7XG4gICAgICAgICAgdGhpcy5jb21wbGV0ZShlbnRyeS5jb21wbGV0aW9uLCBlbnRyeS5hZnRlckxvYyk7XG4gICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJjYXRjaFwiOiBmdW5jdGlvbih0cnlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSB0cnlMb2MpIHtcbiAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgdmFyIHRocm93biA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRocm93bjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgY29udGV4dC5jYXRjaCBtZXRob2QgbXVzdCBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgbG9jYXRpb25cbiAgICAgIC8vIGFyZ3VtZW50IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBrbm93biBjYXRjaCBibG9jay5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdFwiKTtcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVZaWVsZDogZnVuY3Rpb24oaXRlcmFibGUsIHJlc3VsdE5hbWUsIG5leHRMb2MpIHtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSB7XG4gICAgICAgIGl0ZXJhdG9yOiB2YWx1ZXMoaXRlcmFibGUpLFxuICAgICAgICByZXN1bHROYW1lOiByZXN1bHROYW1lLFxuICAgICAgICBuZXh0TG9jOiBuZXh0TG9jXG4gICAgICB9O1xuXG4gICAgICBpZiAodGhpcy5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgIC8vIERlbGliZXJhdGVseSBmb3JnZXQgdGhlIGxhc3Qgc2VudCB2YWx1ZSBzbyB0aGF0IHdlIGRvbid0XG4gICAgICAgIC8vIGFjY2lkZW50YWxseSBwYXNzIGl0IG9uIHRvIHRoZSBkZWxlZ2F0ZS5cbiAgICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cbiAgfTtcbn0pKFxuICAvLyBJbiBzbG9wcHkgbW9kZSwgdW5ib3VuZCBgdGhpc2AgcmVmZXJzIHRvIHRoZSBnbG9iYWwgb2JqZWN0LCBmYWxsYmFjayB0b1xuICAvLyBGdW5jdGlvbiBjb25zdHJ1Y3RvciBpZiB3ZSdyZSBpbiBnbG9iYWwgc3RyaWN0IG1vZGUuIFRoYXQgaXMgc2FkbHkgYSBmb3JtXG4gIC8vIG9mIGluZGlyZWN0IGV2YWwgd2hpY2ggdmlvbGF0ZXMgQ29udGVudCBTZWN1cml0eSBQb2xpY3kuXG4gIChmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcyB8fCAodHlwZW9mIHNlbGYgPT09IFwib2JqZWN0XCIgJiYgc2VsZik7XG4gIH0pKCkgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpXG4pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVnZW5lcmF0b3ItcnVudGltZVwiKTtcbiIsIi8qKlxuICogYWVzLmpzXG4gKi9cblxuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuL3V0aWwuanMnO1xuaW1wb3J0ICogYXMgbm9kZWFwaSBmcm9tICcuL25vZGVhcGkuanMnO1xuaW1wb3J0ICogYXMgd2ViYXBpIGZyb20gJy4vd2ViYXBpLmpzJztcbmltcG9ydCBwYXJhbXMgZnJvbSAnLi9wYXJhbXMuanMnO1xuXG4vKipcbiAqIENoZWNrIGlmIHRoZSBnaXZlbiBhbGdvcml0aG0gc3BlYyBpcyB2YWxpZC5cbiAqIEBwYXJhbSBuYW1lXG4gKiBAcGFyYW0gaXZcbiAqIEBwYXJhbSB0YWdMZW5ndGhcbiAqL1xuZnVuY3Rpb24gYXNzZXJ0QWxnb3JpdGhtcyh7bmFtZSwgaXYsIHRhZ0xlbmd0aH0pe1xuICBpZihPYmplY3Qua2V5cyhwYXJhbXMuY2lwaGVycykuaW5kZXhPZihuYW1lKSA8IDApIHRocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWRBbGdvcml0aG0nKTtcbiAgaWYocGFyYW1zLmNpcGhlcnNbbmFtZV0uaXZMZW5ndGgpe1xuICAgIGlmKCEoaXYgaW5zdGFuY2VvZiBVaW50OEFycmF5KSkgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkQXJndW1lbnRzJyk7XG4gICAgaWYoaXYuYnl0ZUxlbmd0aCA8IDIgfHwgaXYuYnl0ZUxlbmd0aCA+IDE2KSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWRJVkxlbmd0aCcpO1xuICAgIGlmKHBhcmFtcy5jaXBoZXJzW25hbWVdLnN0YXRpY0l2TGVuZ3RoICYmIChwYXJhbXMuY2lwaGVyc1tuYW1lXS5pdkxlbmd0aCAhPT0gaXYuYnl0ZUxlbmd0aCkpIHRocm93IG5ldyBFcnJvcignSW52YWxpZElWTGVuZ3RoJyk7XG4gIH1cbiAgaWYocGFyYW1zLmNpcGhlcnNbbmFtZV0udGFnTGVuZ3RoICYmIHRhZ0xlbmd0aCl7XG4gICAgaWYoIU51bWJlci5pc0ludGVnZXIodGFnTGVuZ3RoKSkgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkQXJndW1lbnRzJyk7XG4gICAgaWYodGFnTGVuZ3RoIDwgNCB8fCB0YWdMZW5ndGggPiAxNikgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkVGFnTGVuZ3RoJyk7XG4gIH1cbn1cblxuLyoqXG4gKiBFbmNyeXB0IHdpdGggQUVTXG4gKiBAcGFyYW0gbXNnXG4gKiBAcGFyYW0ga2V5XG4gKiBAcGFyYW0gbmFtZVxuICogQHBhcmFtIGl2XG4gKiBAcGFyYW0gYWRkaXRpb25hbERhdGFcbiAqIEBwYXJhbSB0YWdMZW5ndGhcbiAqIEByZXR1cm4ge1Byb21pc2U8VWludDhBcnJheT59XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBlbmNyeXB0KG1zZywga2V5LCB7bmFtZSA9ICdBRVMtR0NNJywgaXYsIGFkZGl0aW9uYWxEYXRhPW5ldyBVaW50OEFycmF5KFtdKSwgdGFnTGVuZ3RofSl7XG4gIC8vIGFzc2VydGlvbiBhbmQgc2FuaXRpemluZ1xuICBpZighKG1zZyBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpIHx8ICEoa2V5IGluc3RhbmNlb2YgVWludDhBcnJheSkpIHRocm93IG5ldyBFcnJvcignSW52YWxpZEFyZ3VtZW50cycpO1xuICBhc3NlcnRBbGdvcml0aG1zKHtuYW1lLCBpdiwgdGFnTGVuZ3RofSk7XG4gIGlmKHBhcmFtcy5jaXBoZXJzW25hbWVdLnRhZ0xlbmd0aCAmJiAhdGFnTGVuZ3RoKSB0YWdMZW5ndGggPSBwYXJhbXMuY2lwaGVyc1tuYW1lXS50YWdMZW5ndGg7XG5cbiAgY29uc3Qgd2ViQ3J5cHRvID0gYXdhaXQgdXRpbC5nZXRXZWJDcnlwdG9BbGwoKTsgLy8gd2ViIGNyeXB0byBhcGlcbiAgY29uc3Qgbm9kZUNyeXB0byA9IGF3YWl0IHV0aWwuZ2V0Tm9kZUNyeXB0bygpOyAvLyBub2RlIGNyeXB0b1xuXG4gIGxldCBuYXRpdmUgPSB0cnVlO1xuICBsZXQgZGF0YTtcbiAgaWYgKHR5cGVvZiB3ZWJDcnlwdG8gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiB3ZWJDcnlwdG8uaW1wb3J0S2V5ID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiB3ZWJDcnlwdG8uZW5jcnlwdCA9PT0gJ2Z1bmN0aW9uJykgey8vIGZvciB3ZWIgQVBJIGluY2x1ZGluZyBJRS4uLlxuICAgIGRhdGEgPSBhd2FpdCB3ZWJhcGkuZW5jcnlwdChtc2csIGtleSwge25hbWUsIGl2LCBhZGRpdGlvbmFsRGF0YSwgdGFnTGVuZ3RofSwgd2ViQ3J5cHRvKVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgbmF0aXZlID0gZmFsc2U7XG4gICAgICB9KTtcbiAgfVxuICBlbHNlIGlmICh0eXBlb2Ygbm9kZUNyeXB0byAhPT0gJ3VuZGVmaW5lZCcgKSB7IC8vIGZvciBub2RlXG4gICAgdHJ5e1xuICAgICAgZGF0YSA9IG5vZGVhcGkuZW5jcnlwdChtc2csIGtleSwge25hbWUsIGl2LCBhZGRpdGlvbmFsRGF0YSwgdGFnTGVuZ3RofSwgbm9kZUNyeXB0byk7XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBuYXRpdmUgPSBmYWxzZTtcbiAgICB9XG4gIH0gZWxzZSBuYXRpdmUgPSBmYWxzZTtcblxuICBpZiAobmF0aXZlID09PSBmYWxzZSl7IC8vIGZhbGxiYWNrIHRvIG5hdGl2ZSBpbXBsZW1lbnRhdGlvblxuICAgIHRocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWRFbnZpcm9ubWVudCcpO1xuICAgIC8vIHRyeXtcbiAgICAvLyAgIGtleVBhaXIgPSBhd2FpdCBwdXJlanMuZ2VuZXJhdGVLZXkobmFtZWRDdXJ2ZSk7XG4gICAgLy8gfSBjYXRjaCAoZSkge3Rocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWRFbnZpcm9ubWVudCcpO31cbiAgfVxuXG4gIHJldHVybiBkYXRhO1xufVxuXG5cbi8qKlxuICogRGVjcnlwdCB3aXRoIEFFU1xuICogQHBhcmFtIGRhdGFcbiAqIEBwYXJhbSBrZXlcbiAqIEBwYXJhbSBuYW1lXG4gKiBAcGFyYW0gaXZcbiAqIEBwYXJhbSBhZGRpdGlvbmFsRGF0YVxuICogQHBhcmFtIHRhZ0xlbmd0aFxuICogQHJldHVybiB7UHJvbWlzZTxVaW50OEFycmF5Pn1cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlY3J5cHQoZGF0YSwga2V5LCB7bmFtZT0nQUVTLUdDTScsIGl2LCBhZGRpdGlvbmFsRGF0YT1uZXcgVWludDhBcnJheShbXSksIHRhZ0xlbmd0aH0pe1xuICAvLyBhc3NlcnRpb24gYW5kIHNhbml0aXppbmdcbiAgaWYoIShkYXRhIGluc3RhbmNlb2YgVWludDhBcnJheSkgfHwgIShrZXkgaW5zdGFuY2VvZiBVaW50OEFycmF5KSkgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkQXJndW1lbnRzJyk7XG4gIGFzc2VydEFsZ29yaXRobXMoe25hbWUsIGl2LCB0YWdMZW5ndGh9KTtcbiAgaWYocGFyYW1zLmNpcGhlcnNbbmFtZV0udGFnTGVuZ3RoICYmICF0YWdMZW5ndGgpIHRhZ0xlbmd0aCA9IHBhcmFtcy5jaXBoZXJzW25hbWVdLnRhZ0xlbmd0aDtcblxuICBjb25zdCB3ZWJDcnlwdG8gPSBhd2FpdCB1dGlsLmdldFdlYkNyeXB0b0FsbCgpOyAvLyB3ZWIgY3J5cHRvIGFwaVxuICBjb25zdCBub2RlQ3J5cHRvID0gYXdhaXQgdXRpbC5nZXROb2RlQ3J5cHRvKCk7IC8vIG5vZGUgY3J5cHRvXG5cbiAgbGV0IG5hdGl2ZSA9IHRydWU7XG4gIGxldCBlcnJNc2c7XG4gIGxldCBtc2c7XG4gIGlmICh0eXBlb2Ygd2ViQ3J5cHRvICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygd2ViQ3J5cHRvLmltcG9ydEtleSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygd2ViQ3J5cHRvLmVuY3J5cHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICBtc2cgPSBhd2FpdCB3ZWJhcGkuZGVjcnlwdChkYXRhLCBrZXksIHtuYW1lLCBpdiwgYWRkaXRpb25hbERhdGEsIHRhZ0xlbmd0aH0sIHdlYkNyeXB0bykuY2F0Y2goKGUpID0+IHtcbiAgICAgIG5hdGl2ZSA9IGZhbHNlO1xuICAgICAgZXJyTXNnID0gZS5tZXNzYWdlO1xuICAgIH0pO1xuICB9XG4gIGVsc2UgaWYgKHR5cGVvZiBub2RlQ3J5cHRvICE9PSAndW5kZWZpbmVkJyl7XG4gICAgdHJ5e1xuICAgICAgbXNnID0gbm9kZWFwaS5kZWNyeXB0KGRhdGEsIGtleSwge25hbWUsIGl2LCBhZGRpdGlvbmFsRGF0YSwgdGFnTGVuZ3RofSwgbm9kZUNyeXB0byk7XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBuYXRpdmUgPSBmYWxzZTtcbiAgICAgIGVyck1zZyA9IGUubWVzc2FnZTtcbiAgICB9XG4gIH1cblxuICBpZiAobmF0aXZlID09PSBmYWxzZSl7IC8vIGZhbGxiYWNrIHRvIG5hdGl2ZSBpbXBsZW1lbnRhdGlvblxuICAgIGlmKGVyck1zZykgdGhyb3cgbmV3IEVycm9yKGVyck1zZyk7XG4gICAgZWxzZSB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkRW52aXJvbm1lbnQnKTtcbiAgICAvLyB0cnl7XG4gICAgLy8gICBrZXlQYWlyID0gYXdhaXQgcHVyZWpzLmdlbmVyYXRlS2V5KG5hbWVkQ3VydmUpO1xuICAgIC8vIH0gY2F0Y2ggKGUpIHt0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkRW52aXJvbm1lbnQnKTt9XG4gIH1cblxuICByZXR1cm4gbXNnO1xufSIsIi8qKlxuICogaW5kZXguanNcbiAqL1xuXG5pbXBvcnQge2VuY3J5cHQsIGRlY3J5cHR9IGZyb20gJy4vYWVzLmpzJztcblxuZXhwb3J0IGRlZmF1bHQge2VuY3J5cHQsIGRlY3J5cHR9O1xuZXhwb3J0IHtlbmNyeXB0LCBkZWNyeXB0fTsiLCIvKipcbiAqIG5vZGVhcGkuanNcbiAqL1xuXG5pbXBvcnQgcGFyYW1zIGZyb20gJy4vcGFyYW1zLmpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGVuY3J5cHQobXNnLCBrZXksIHtuYW1lID0gJ0FFUy1HQ00nLCBpdiwgYWRkaXRpb25hbERhdGEsIHRhZ0xlbmd0aH0sIG5vZGVDcnlwdG8pe1xuICBsZXQgYWxnID0gcGFyYW1zLmNpcGhlcnNbbmFtZV0ubm9kZVByZWZpeDtcbiAgYWxnID0gYCR7YWxnfS0keyhrZXkuYnl0ZUxlbmd0aCo4KS50b1N0cmluZygpfS1gO1xuICBhbGcgPSBhbGcgKyBwYXJhbXMuY2lwaGVyc1tuYW1lXS5ub2RlU3VmZml4O1xuXG4gIGxldCBjaXBoZXI7XG4gIHN3aXRjaChuYW1lKXtcbiAgY2FzZSAnQUVTLUdDTSc6IHtcbiAgICBjaXBoZXIgPSBub2RlQ3J5cHRvLmNyZWF0ZUNpcGhlcml2KGFsZywga2V5LCBpdiwge2F1dGhUYWdMZW5ndGg6IHRhZ0xlbmd0aH0pO1xuICAgIGNpcGhlci5zZXRBQUQoYWRkaXRpb25hbERhdGEpO1xuICAgIGJyZWFrO1xuICB9XG4gIGNhc2UgJ0FFUy1DQkMnOiB7XG4gICAgY2lwaGVyID0gbm9kZUNyeXB0by5jcmVhdGVDaXBoZXJpdihhbGcsIGtleSwgaXYpO1xuICAgIGJyZWFrO1xuICB9XG4gIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWRDaXBoZXInKTtcbiAgfVxuXG4gIGNvbnN0IGJvZHkgPSBuZXcgVWludDhBcnJheShjaXBoZXIudXBkYXRlKG1zZykpO1xuICBjb25zdCBmaW5hbCA9IG5ldyBVaW50OEFycmF5KGNpcGhlci5maW5hbCgpKTtcblxuICBsZXQgdGFnID0gbmV3IFVpbnQ4QXJyYXkoW10pO1xuICBpZihuYW1lID09PSAnQUVTLUdDTScpIHRhZyA9IG5ldyBVaW50OEFycmF5KGNpcGhlci5nZXRBdXRoVGFnKCkpO1xuXG4gIGNvbnN0IGRhdGEgPSBuZXcgVWludDhBcnJheShib2R5Lmxlbmd0aCArIGZpbmFsLmxlbmd0aCArIHRhZy5sZW5ndGgpO1xuICBkYXRhLnNldChib2R5KTtcbiAgZGF0YS5zZXQoZmluYWwsIGJvZHkubGVuZ3RoKTtcbiAgZGF0YS5zZXQodGFnLCBib2R5Lmxlbmd0aCArIGZpbmFsLmxlbmd0aCk7XG5cbiAgcmV0dXJuIGRhdGE7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGRlY3J5cHQoZGF0YSwga2V5LCB7bmFtZT0nQUVTLUdDTScsIGl2LCBhZGRpdGlvbmFsRGF0YSwgdGFnTGVuZ3RofSwgbm9kZUNyeXB0bykge1xuICBsZXQgYWxnID0gcGFyYW1zLmNpcGhlcnNbbmFtZV0ubm9kZVByZWZpeDtcbiAgYWxnID0gYCR7YWxnfS0keyhrZXkuYnl0ZUxlbmd0aCo4KS50b1N0cmluZygpfS1gO1xuICBhbGcgPSBhbGcgKyBwYXJhbXMuY2lwaGVyc1tuYW1lXS5ub2RlU3VmZml4O1xuXG4gIGxldCBkZWNpcGhlcjtcbiAgbGV0IGJvZHk7XG4gIHN3aXRjaChuYW1lKXtcbiAgY2FzZSAnQUVTLUdDTSc6IHtcbiAgICBkZWNpcGhlciA9IG5vZGVDcnlwdG8uY3JlYXRlRGVjaXBoZXJpdihhbGcsIGtleSwgaXYsIHthdXRoVGFnTGVuZ3RoOiB0YWdMZW5ndGh9KTtcbiAgICBkZWNpcGhlci5zZXRBQUQoYWRkaXRpb25hbERhdGEpO1xuICAgIGJvZHkgPSBkYXRhLnNsaWNlKDAsIGRhdGEubGVuZ3RoIC0gdGFnTGVuZ3RoKTtcbiAgICBjb25zdCB0YWcgPSBkYXRhLnNsaWNlKGRhdGEubGVuZ3RoIC0gdGFnTGVuZ3RoKTtcbiAgICBkZWNpcGhlci5zZXRBdXRoVGFnKHRhZyk7XG4gICAgYnJlYWs7XG4gIH1cbiAgY2FzZSAnQUVTLUNCQyc6IHtcbiAgICBkZWNpcGhlciA9IG5vZGVDcnlwdG8uY3JlYXRlRGVjaXBoZXJpdihhbGcsIGtleSwgaXYpO1xuICAgIGJvZHkgPSBkYXRhO1xuICAgIGJyZWFrO1xuICB9XG4gIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWRDaXBoZXInKTtcbiAgfVxuXG4gIGNvbnN0IGRlY3J5cHRlZEJvZHkgPSBkZWNpcGhlci51cGRhdGUoYm9keSk7XG4gIGxldCBmaW5hbDtcbiAgdHJ5e1xuICAgIGZpbmFsID0gZGVjaXBoZXIuZmluYWwoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignRGVjcnlwdGlvbkZhaWx1cmUnKTtcbiAgfVxuICBjb25zdCBtc2cgPSBuZXcgVWludDhBcnJheShmaW5hbC5sZW5ndGggKyBkZWNyeXB0ZWRCb2R5Lmxlbmd0aCk7XG4gIG1zZy5zZXQoZGVjcnlwdGVkQm9keSk7XG4gIG1zZy5zZXQoZmluYWwsIGRlY3J5cHRlZEJvZHkubGVuZ3RoKTtcblxuICByZXR1cm4gbXNnO1xufSIsIi8qKlxuICogcGFyYW1zLmpzXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQge1xuICBjaXBoZXJzOiB7XG4gICAgJ0FFUy1HQ00nOiB7XG4gICAgICBub2RlUHJlZml4OiAnYWVzJyxcbiAgICAgIG5vZGVTdWZmaXg6ICdnY20nLFxuICAgICAgaXZMZW5ndGg6IDEyLCAgLy8gZGVmYXVsdCB2YWx1ZSBvZiBpdiBsZW5ndGgsIDEyIGJ5dGVzIGlzIHJlY29tbWVuZGVkIGZvciBBRVMtR0NNXG4gICAgICB0YWdMZW5ndGg6IDE2LFxuICAgICAgc3RhdGljSXZMZW5ndGg6IHRydWUgLy8gaWYgdHJ1ZSwgSVYgbGVuZ3RoIG11c3QgYmUgYWx3YXlzIGl2TGVuZ3RoLlxuICAgIH0sXG4gICAgJ0FFUy1DQkMnOiB7XG4gICAgICBub2RlUHJlZml4OiAnYWVzJyxcbiAgICAgIG5vZGVTdWZmaXg6ICdjYmMnLFxuICAgICAgaXZMZW5ndGg6IDE2LFxuICAgICAgc3RhdGljSXZMZW5ndGg6IHRydWVcbiAgICB9XG4gIH1cbn07IiwiLyoqXG4gKiB1dGlsLmpzXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFdlYkNyeXB0b0FsbCAoKSB7XG4gIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykgcmV0dXJuIHVuZGVmaW5lZDtcbiAgZWxzZSB7XG4gICAgaWYgKHdpbmRvdy5tc0NyeXB0bykgcmV0dXJuIHdpbmRvdy5tc0NyeXB0by5zdWJ0bGU7XG4gICAgaWYgKHdpbmRvdy5jcnlwdG8pIHJldHVybiB3aW5kb3cuY3J5cHRvLnN1YnRsZTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Tm9kZUNyeXB0bygpe1xuICBpZih0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgcmV0dXJuIHVuZGVmaW5lZDtcbiAgZWxzZSByZXR1cm4gcmVxdWlyZSgnY3J5cHRvJyk7XG59IiwiLyoqXG4gKiB3ZWJhcGkuanNcbiAqL1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZW5jcnlwdChtc2csIGtleSwge25hbWUgPSAnQUVTLUdDTScsIGl2LCBhZGRpdGlvbmFsRGF0YSwgdGFnTGVuZ3RofSwgd2ViQ3J5cHRvKSB7XG4gIGxldCBhbGc7XG5cbiAgc3dpdGNoKG5hbWUpe1xuICBjYXNlICdBRVMtR0NNJzoge1xuICAgIGFsZyA9IE9iamVjdC5hc3NpZ24oe25hbWUsIGl2LCB0YWdMZW5ndGg6IHRhZ0xlbmd0aCAqIDh9LCAoYWRkaXRpb25hbERhdGEubGVuZ3RoID4gMCkgPyB7YWRkaXRpb25hbERhdGF9IDoge30pO1xuICAgIGJyZWFrO1xuICB9XG4gIGNhc2UgJ0FFUy1DQkMnOiBhbGcgPSB7bmFtZSwgaXZ9O1xuICAgIGJyZWFrO1xuICBkZWZhdWx0OiB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkQ2lwaGVyJyk7XG4gIH1cblxuICBpZiAodHlwZW9mIHdpbmRvdy5tc0NyeXB0byA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBtb2Rlcm4gYnJvd3NlcnNcbiAgICBjb25zdCBzZXNzaW9uS2V5T2JqID0gYXdhaXQgd2ViQ3J5cHRvLmltcG9ydEtleSgncmF3Jywga2V5LCBhbGcsIGZhbHNlLCBbJ2VuY3J5cHQnLCAnZGVjcnlwdCddKTtcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgd2ViQ3J5cHRvLmVuY3J5cHQoYWxnLCBzZXNzaW9uS2V5T2JqLCBtc2cpO1xuICAgIHJldHVybiBuZXcgVWludDhBcnJheShkYXRhKTtcbiAgfVxuICBlbHNlIHtcbiAgICBjb25zdCBzZXNzaW9uS2V5T2JqID0gYXdhaXQgbXNJbXBvcnRLZXkoJ3JhdycsIGtleSwgYWxnLCBmYWxzZSwgWydlbmNyeXB0JywgJ2RlY3J5cHQnXSwgd2ViQ3J5cHRvKTtcbiAgICBjb25zdCBlbmNyeXB0ZWRPYmogPSBhd2FpdCBtc0VuY3J5cHQoYWxnLCBzZXNzaW9uS2V5T2JqLCBtc2csIHdlYkNyeXB0byk7XG5cbiAgICBpZiAobmFtZSA9PT0gJ0FFUy1HQ00nKSB7XG4gICAgICBjb25zdCBkYXRhID0gbmV3IFVpbnQ4QXJyYXkoZW5jcnlwdGVkT2JqLmNpcGhlcnRleHQuYnl0ZUxlbmd0aCArIGVuY3J5cHRlZE9iai50YWcuYnl0ZUxlbmd0aCk7XG4gICAgICBkYXRhLnNldChuZXcgVWludDhBcnJheShlbmNyeXB0ZWRPYmouY2lwaGVydGV4dCkpO1xuICAgICAgZGF0YS5zZXQobmV3IFVpbnQ4QXJyYXkoZW5jcnlwdGVkT2JqLnRhZyksIGVuY3J5cHRlZE9iai5jaXBoZXJ0ZXh0LmJ5dGVMZW5ndGgpO1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSBlbHNlIHJldHVybiBuZXcgVWludDhBcnJheShlbmNyeXB0ZWRPYmopO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWNyeXB0KGRhdGEsIGtleSwge25hbWU9J0FFUy1HQ00nLCBpdiwgYWRkaXRpb25hbERhdGEsIHRhZ0xlbmd0aH0sIHdlYkNyeXB0bykge1xuICBsZXQgYWxnO1xuICBzd2l0Y2gobmFtZSl7XG4gIGNhc2UgJ0FFUy1HQ00nOiB7XG4gICAgYWxnID0gT2JqZWN0LmFzc2lnbih7bmFtZSwgaXYsIHRhZ0xlbmd0aDogdGFnTGVuZ3RoICogOH0sIChhZGRpdGlvbmFsRGF0YS5sZW5ndGggPiAwKSA/IHthZGRpdGlvbmFsRGF0YX0gOiB7fSk7XG4gICAgYnJlYWs7XG4gIH1cbiAgY2FzZSAnQUVTLUNCQyc6IGFsZyA9IHtuYW1lLCBpdn07XG4gICAgYnJlYWs7XG4gIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWRDaXBoZXInKTtcbiAgfVxuXG4gIGlmICghd2luZG93Lm1zQ3J5cHRvKSB7XG4gICAgLy8gbW9kZXJuIGJyb3dzZXJzXG4gICAgY29uc3Qgc2Vzc2lvbktleU9iaiA9IGF3YWl0IHdlYkNyeXB0by5pbXBvcnRLZXkoJ3JhdycsIGtleSwgYWxnLCBmYWxzZSwgWydlbmNyeXB0JywgJ2RlY3J5cHQnXSk7XG4gICAgY29uc3QgbXNnID0gYXdhaXQgd2ViQ3J5cHRvLmRlY3J5cHQoYWxnLCBzZXNzaW9uS2V5T2JqLCBkYXRhKS5jYXRjaCgoKSA9PiB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RlY3J5cHRpb25GYWlsdXJlJyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KG1zZyk7XG4gIH1cbiAgZWxzZSB7XG4gICAgY29uc3Qgc2Vzc2lvbktleU9iaiA9IGF3YWl0IG1zSW1wb3J0S2V5KCdyYXcnLCBrZXksIGFsZywgZmFsc2UsIFsnZW5jcnlwdCcsICdkZWNyeXB0J10sIHdlYkNyeXB0byk7XG4gICAgaWYgKG5hbWUgPT09ICdBRVMtR0NNJykge1xuICAgICAgY29uc3QgY2lwaGVydGV4dCA9IGRhdGEuc2xpY2UoMCwgZGF0YS5sZW5ndGggLSB0YWdMZW5ndGgpO1xuICAgICAgY29uc3QgdGFnID0gZGF0YS5zbGljZShkYXRhLmxlbmd0aCAtIHRhZ0xlbmd0aCwgZGF0YS5sZW5ndGgpO1xuICAgICAgY29uc3QgbXNnID0gYXdhaXQgbXNEZWNyeXB0KE9iamVjdC5hc3NpZ24oYWxnLCB7dGFnfSksIHNlc3Npb25LZXlPYmosIGNpcGhlcnRleHQsIHdlYkNyeXB0bykuY2F0Y2goKCkgPT4ge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RlY3J5cHRpb25GYWlsdXJlJyk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBuZXcgVWludDhBcnJheShtc2cpO1xuICAgIH0gZWxzZXtcbiAgICAgIGNvbnN0IG1zZyA9IGF3YWl0IG1zRGVjcnlwdChhbGcsIHNlc3Npb25LZXlPYmosIGRhdGEsIHdlYkNyeXB0bykuY2F0Y2goKCkgPT4ge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RlY3J5cHRpb25GYWlsdXJlJyk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBuZXcgVWludDhBcnJheShtc2cpO1xuICAgIH1cbiAgfVxufVxuXG5cbi8vIGZ1bmN0aW9uIGRlZmluaXRpb25zIGZvciBJRVxuY29uc3QgbXNJbXBvcnRLZXkgPSAodHlwZSwga2V5LCBhbGcsIGV4dCwgdXNlLCB3ZWJDcnlwdG8pID0+IG5ldyBQcm9taXNlICggKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICBjb25zdCBvcCA9IHdlYkNyeXB0by5pbXBvcnRLZXkodHlwZSwga2V5LCBhbGcsIGV4dCwgdXNlKTtcbiAgb3Aub25jb21wbGV0ZSA9IChldnQpID0+IHsgcmVzb2x2ZShldnQudGFyZ2V0LnJlc3VsdCk7IH07XG4gIG9wLm9uZXJyb3IgPSAoKSA9PiB7IHJlamVjdCgnS2V5SW1wb3J0aW5nRmFpbGVkJyk7IH07XG59KTtcbmNvbnN0IG1zRW5jcnlwdCA9IChhbGcsIGtleSwgbXNnLCB3ZWJDcnlwdG8pID0+IG5ldyBQcm9taXNlICggKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICBjb25zdCBvcCA9IHdlYkNyeXB0by5lbmNyeXB0KGFsZywga2V5LCBtc2cpO1xuICBvcC5vbmNvbXBsZXRlID0gKGV2dCkgPT4geyByZXNvbHZlKGV2dC50YXJnZXQucmVzdWx0KTsgfTtcbiAgb3Aub25lcnJvciA9ICgpID0+IHsgcmVqZWN0KCdFbmNyeXB0aW9uRmFpbHVyZScpOyB9O1xufSk7XG5jb25zdCBtc0RlY3J5cHQgPSAoYWxnLCBrZXksIGRhdGEsIHdlYkNyeXB0bykgPT4gbmV3IFByb21pc2UgKCAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gIGNvbnN0IG9wID0gd2ViQ3J5cHRvLmRlY3J5cHQoYWxnLCBrZXksIGRhdGEpO1xuICBvcC5vbmNvbXBsZXRlID0gKGV2dCkgPT4geyByZXNvbHZlKGV2dC50YXJnZXQucmVzdWx0KTsgfTtcbiAgb3Aub25lcnJvciA9ICgpID0+IHsgcmVqZWN0KCdEZWNyeXB0aW9uRmFpbHVyZScpOyB9O1xufSk7IiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX2NyeXB0b19fOyJdLCJzb3VyY2VSb290IjoiIn0=