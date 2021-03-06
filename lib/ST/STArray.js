//Subclassed Array using Stack
//http://webreflection.blogspot.com/2008/05/habemus-array-unlocked-length-in-ie8.html
STArray = (function(){
    function STArray(){
        this.push.apply(this, Array.apply(null, arguments));
        this.$ = STArray;
    };
    STArray.prototype = new Array;
    STArray.prototype.length = 0;
    if(!new STArray(1).length){
        STArray.prototype = {length:0};
        for(var
            split = "join.pop.push.reverse.shift.slice.sort.splice.unshift".split("."),
            length = split.length;
            length;
        )
            STArray.prototype[split[--length]] = Array.prototype[split[length]];
    };
    var toString= Object.prototype.toString,
        slice   = Array.prototype.slice,
        concat  = Array.prototype.concat
    ;
    STArray.prototype.concat = function(){
        for(var Array = this.slice(0), i = 0, length = arguments.length; i < length; ++i){
            if(toString.call(arguments[i]) != "[object Array]")
                arguments[i] = typeof arguments[i] == "object" ? slice.call(arguments[i]) : [arguments[i]];
        };
        Array.push.apply(Array, concat.apply([], arguments));
        return  Array;
    };
    STArray.prototype.toString = STArray.prototype.join;
    STArray.prototype.constructor = STArray;
    return STArray;
})();

STArray.create = function()
{
    var a = new STArray();
    if (arguments.length) {
        a.append(arguments);
    }
    return a;
};

STArray.createWithArray = function(array)
{
    return new STArray().append(array);
};

if (!STArray.prototype.indexOf) {
    STArray.prototype.indexOf = function(v, n)
    {
        n = (n == null) ? 0 : n;
        var m = this.length;
        for (var i = n; i < m; i++) {
            if (this[i] == v) return i;
        }
        return -1;
    };
}

/**
 * Runs the specified callback function for each item in this array.
 *
 * @param {Function} fun Callback function
 */
STArray.prototype.each = function(fun, object) {
    var fun = ST.P(fun);

    for (var i = 0; i < this.length; i++) {
        if (fun.call(object, this[i], i) == 'break') break;
    }

    return this;
};

/**
 * Runs the specified callback function for each item in this array, in an
 * asynchronous manner.
 *
 * @param {Function} fun Callback function
 *
 * Options:
 *      done:       callback to call when all complete
 *      steps:      total number of synchronous steps to take       
 *  or  iteration:  number of items to process in each iteration
 */
STArray.prototype.eachAsync = function(fun, options) {
    var self = this;
    var opts = options || {};
    var fun = ST.P(fun);
    
    var iteration = 1;
    if (opts.steps) iteration = Math.round(this.length / opts.steps);
    if (opts.iteration) iteration = opts.iteration;
    if (iteration < 1) iteration = 1;
    
    var i = 0;
    var loop = iteration - 1;
    var step = function() {
        fun.call(opts.object || null, self[i], i);
        i++;
        if (i < self.length) {
            if (loop > 0) {
                loop--;
                step();
            } else {
                loop = iteration - 1;
                setTimeout(step, 1);
            }
        } else if (opts.done) {
            setTimeout(opts.done, 1);
        }
    }
    setTimeout(step, 1);

    return this;
};

/**
 * Removes all items from this array.
 */
STArray.prototype.empty = function()
{
    this.length = 0;
    return this;
};

/**
 * Calls the release method on each item, then removes all items in this Array.
 */
STArray.prototype.releaseAndEmpty = function() {
    this.each('release').length = 0;
    return this;
};

/**
 * Returns true if array is empty (contains no items).
 */
STArray.prototype.isEmpty = function()
{
    return this.length == 0;
};

/**
 * Returns last item in this array, or null if empty.
 */
STArray.prototype.last = function()
{
    if (this.length == 0) return null;
    return this[this.length-1];
};

/**
 * Returns true if array contains the specified item.
 */
STArray.prototype.has = function(object)
{
    return this.indexOf(object) >= 0;
};

/**
 * Returns true if callback function for at least one array member returns
 * true.
 * 
 * @param {Function} callback Callback function
 */
STArray.prototype.any = function(fun, object)
{
    var fun = ST.P(fun);

    for (var i = 0; i < this.length; i++) {
        if (fun.call(object, this[i], i)) return true;
    }
    return false;
};

/**
 * Returns true if callback function for every array member returns true.
 *
 * @param {Function} callback Callback function
 */
STArray.prototype.all = function(fun, object)
{
    var fun = ST.P(fun);

    for (var i = 0; i < this.length; i++) {
        if (!fun.call(object, this[i], i)) return false;
    }
    return true;
};

/**
 * Returns a new copy of array with callback function applied to each item.
 */
STArray.prototype.map = function(fun, object)
{
    var fun = ST.P(fun);

    var res = new STArray();
    for (var i = 0; i < this.length; i++) {
        res.push(fun.call(object, this[i], i, this));
    }
    return res;
};

/**
 * Maps all items through a callback function, and returns a standard Array
 * object.
 */
STArray.prototype.mapToStdArray = function(fun, thisp)
{
    var fun = ST.P(fun);

    var res = [];
    for (var i = 0; i < this.length; i++) {
        res.push(fun.call(thisp || null, this[i], i, this));
    }
    return res;
};

/**
 * Creates a copy of array as a standard Array object.
 */
STArray.prototype.toStdArray = function()
{
    var res = [];
    for (var i = 0; i < this.length; i++) {
        res.push(this[i]);
    }
    return res;
};

/**
 * Returns sum of all items.
 */
STArray.prototype.sum = function(initial)
{
    var c = initial || 0;
    for (var i = 0; i < this.length; i++) {
        c += this[i];
    }
    return c;
};

/**
 * Adds items in another array to the end of this one.
 */
STArray.prototype.append = function(array)
{
    this.push.apply(this, array);
    return this;
};

/**
 * Inserts an item at the specified index in Array.
 */
STArray.prototype.insert = function(index, item)
{
    this.splice(index, 0, item);
};

/**
 * Removes the given item from this array, if found,
 */
STArray.prototype.remove = function(object)
{
    for (i = 0; i < this.length; i++) {
        if (this[i] == object) {
            this.splice(i--, 1);
        }
    }
};

/**
 * Removes the item at the given index from this array.
 */
STArray.prototype.removeAtIndex = function(index)
{
    this.splice(index, 1);
};

/**
 * Returns the first item in this array where callback(item) evaluates true
 */
STArray.prototype.find = function(fun, object)
{
    var fun = ST.P(fun);

    for (var i = 0; i < this.length; i++) {
        if (fun.call(object, this[i], i)) return this[i];
    }
    return null;
};

/**
 * Removes all items from this array where callback(item) evaluates to true
 */
STArray.prototype.findRemove = function(fun, object)
{
    var fun = ST.P(fun);

    for (var i = 0; i < this.length; i++) {
        if (fun.call(object, this[i], i)) {
            this.splice(i, 1);
            i--;
        }
    }
    return null;
};

STArray.prototype.findBy = function(key, value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i][key] == value) return this[i];
    }
    return null;
};

/**
 * Removes from array any items with index greater than specified index.
 */
STArray.prototype.trimTo = function(index)
{
    if (this.length > (index + 1)) {
        this.splice(index + 1, this.length - (index+1));
    }
};

/**
 * Returns a new array with the same items as this one (shallow copy).
 */
STArray.prototype.copy = function()
{
    return this.slice();
};

/**
 * Returns a new array containing items within the specified range.
 */
STArray.prototype.slice = function(from, length)
{
    var min = from || 0;
    var max = this.length - 1 - min;
    if (length) max = Math.min(max, min + length - 1);
    var a = STArray.create();
    for (var i = min; i <= max; i++) {
        a.push(this[i]);
    }
    return a;
};

/**
 * Returns a new array with no duplicates.
 */
STArray.prototype.unique = function()
{
    // Build a hash of array items, indexed by unique key
    var h = {};
    for (var i = 0; i < this.length; i++) {
        // Use _uid property as unique key if available, otherwise convert
        // object to string for key.
        h[this[i] && this[i]._uid || this[i]] = this[i];
    }

    // Build new array with now unique items in hash
    var a = new STArray();
    for (i in h) a.push(h[i]);
    return a;
};

/**
 * Returns a new array containing only items where callback returns true
 */
STArray.prototype.collect = function(fun, object) {
    var fun = ST.P(fun);

    var a = new STArray();
    for (var i = 0; i < this.length; i++) {
        if (fun.call(object, this[i], i)) a.push(this[i]);
    }
    return a;
};

/**
 * Returns a new array containing only items where callback returns false
 */
STArray.prototype.reject = function(fun, object) {
    var fun = ST.P(fun);

    var a = new STArray();
    for (var i = 0; i < this.length; i++) {
        if (!fun.call(object, this[i], i)) a.push(this[i]);
    }
    return a;
};

STArray.prototype.min = function(initial)
{
    var value = initial || 0;
    for (var i = 0; i < this.length; i++) {
        if (this[i] < value) value = this[i];
    }
    return value;
};

STArray.prototype.max = function(initial)
{
    var value = initial || 0;
    for (var i = 0; i < this.length; i++) {
        if (this[i] > value) value = this[i];
    }
    return value;
};
