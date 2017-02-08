var pair_primitives = (function() {
    var pair_identity = function() {};
    var empty_list = function() {};

    function pair(x, y) {
        var res = function(z) {
            if (z === 'x') {
                return x;
            } else if (z === 'y') {
                return y;
            } else {
                return pair_identity;
            }
        };
        res.toString = pair_to_string.bind(null, res); // low-level, not JediScript!
        return res;
    }

    function is_pair(x) {
        var isFunction = (typeof x === 'function');
        return (isFunction && x(false) === pair_identity);
    }

    return function(z) {
        switch(z) {
            case 'empty_list': return empty_list;
            case 'pair': return pair;
            case 'is_pair': return is_pair;
        }
    };

})();

var empty_list = pair_primitives('empty_list');
var pair = pair_primitives('pair');
var is_pair = pair_primitives('is_pair');

function head(xs) {
    if (is_pair(xs)) {
        return xs('x');
    } else {
        throw new Error("head(xs) expects a pair as "
            + "argument xs, but encountered " + xs);
    }
}

function tail(xs) {
    if (is_pair(xs)) {
        return xs('y');
    } else {
        throw new Error("tail(xs) expects a pair as " +
            "argument xs, but encountered " + xs);
    }
}

function pair_to_string(ls) {
    function combine(lst) {
        if (lst === empty_list) {
            return '';
        } else if (is_pair(tail(lst))) {
            return head(lst) + ' ' + combine(tail(lst));
        } else if (tail(lst) === empty_list) {
            return head(lst);
        } else {
            return head(lst) + ' . ' + tail(lst);
        }
    }
    return '(' + combine(ls) + ')';
}

function equal(item1, item2) {
    if (is_pair(item1) && is_pair(item2)) {
        return equal(head(item1), head(item2)) &&
            equal(tail(item1), tail(item2));
    } else {
        return item1 === item2;
    }
}


function is_list(xs) {
    if (xs === empty_list) {
        return true;
    } else {
        return is_pair(xs) && is_list(tail(xs));
    }
}

function is_empty_list(xs) {
    if (is_list(xs) === false) {
        throw new Error("is_empty_list(xs) expects empty list " +
            "or pair as argument xs, but encountered " + xs);
    } else {
        return xs === empty_list;
    }
}

function list() {
    var args = arguments;
    var argsLength = arguments.length;
    
    function rec(i) {
        if (i === argsLength) {
            return empty_list;
        } else {
            return pair(args[i], rec(i+1));
        }
    }

    return rec(0);
}

function map(f, xs) {
    if (is_empty_list(xs)) {
        return empty_list;
    } else {
        return pair(f(head(xs)), map(f, tail(xs)));
    }
}

function build_list(n, f) {
    function iter(i, acc) {
        if (i < 0) {
            return acc;
        } else {
            return iter(i-1, pair(f(i), acc));
        }
    }
    return iter(n-1, empty_list);
}

function for_each(f, xs) {
    if (is_empty_list(xs)) {
        return true;
    } else {
        f(head(xs));
        return for_each(f, tail(xs));
    }
}

function reverse(xs) {
    function rev(original, reversed) {
        if (is_empty_list(original)) {
            return reversed;
        } else {
            return rev(tail(original), pair(head(original), reversed));
        }
    }
    return rev(xs, empty_list);
}

function append(xs, ys) {
    if (is_empty_list(xs)) {
        return ys;
    } else {
        return pair(head(xs), append(tail(xs), ys));
    }
}

function member(v, xs) {
    if (is_empty_list(xs)) {
        return empty_list;
    } else {
        if (v === head(xs)) {
            return xs;
        } else {
            return member(v, tail(xs));
        }
    }
}

function remove(v, xs) {
    if (is_empty_list(xs)) {
        return empty_list;
    } else {
        if (v === head(xs)) {
            return tail(xs);
        } else {
            return pair(head(xs), remove(v, tail(xs)));
        }
    }
}

function remove_all(v, xs) {
    return filter(function(element) {
        return element !== v;
    }, xs);
}

function assoc(v, xs) {
    if (is_empty_list(xs)) {
        return false;
    } else if (equal(v, head(head(xs)))) {
        return head(xs);
    } else {
        return assoc(v, tail(xs));
    }
}

function filter(pred, xs) {
    if (is_empty_list(xs)) {
        return xs;
    } else {
        var p = pred(head(xs));
        if (p === true) {
            return pair(head(xs), filer(perd, tail(xs)));
        } else if (p === false) {
            return filter(pred, tail(xs));
        } else {
            throw new Error("pred must evaluate to either true or false");
        }
    }
}

function enum_list(start, end) {
    if (start > end) {
        return empty_list;
    } else {
        return pair(start, enum_list(start + 1, end));
    }
}

function list_ref(xs, n) {
    if (n === 0) {
        return head(xs);
    } else {
        return list_ref(tail(xs, n-1));
    }
}

function accumulate(op, initial, sequence) {
    if (is_empty_list(sequence)) {
        return initial;
    } else {
        return op(head(sequence),
                accumulate(op, initial, tail(sequence)));
    }
}