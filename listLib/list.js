// list.js: Supporting lists in the Scheme style, using pairs made 
//          up of two-element JavaScript array (vector)

// Author: Martin Henz

// array test works differently for Rhino and
// the Firefox environment (especially Web Console)
function array_test(x) {
    if (this.Array.isArray === undefined) {
	return x instanceof Array;
    } else {
	return Array.isArray(x);
    }
}

// pair constructs a pair using a two-element array
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT
function pair(x, xs) {
    return [x, xs];
}

// is_pair returns true iff arg is a two-element array
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT
function is_pair(x) {
    return array_test(x) && x.length === 2;
}

// head returns the first component of the given pair,
// throws an exception if the argument is not a pair
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT
function head(xs) {
    if (is_pair(xs)) {
        return xs[0];
    } else {
        throw new Error("head(xs) expects a pair as "
			+ "argument xs, but encountered "+xs);
    }
}

// tail returns the second component of the given pair
// throws an exception if the argument is not a pair
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT
function tail(xs) {
    if (is_pair(xs)) {
        return xs[1];
    } else {
        throw new Error("tail(xs) expects a pair as "
			+ "argument xs, but encountered "+xs);
    }

}

// is_empty_list returns true if arg is []
//// throws an exception if arg is not [] or a pair
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT
function is_empty_list(xs) {
    if (array_test(xs)) {
        if  (xs.length === 0) {
            return true; }
        else if (xs.length === 2) {
            return false; }
        else {
            throw new Error("is_empty_list(xs) expects empty list " +
			    "or pair as argument xs, but encountered "+xs);
        }
    } else {
        throw new Error("is_empty_list(xs) expects empty list or pair " +
			"as argument xs, but encountered "+ xs);
    }
}

// is_list recurses down the list and checks that it ends with the empty list []
// does not throw any exceptions
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT
function is_list(xs) {
    return (array_test(xs) && xs.length === 0) 
	|| (is_pair(xs) && is_list(tail(xs)));
}

// list makes a list out of its arguments
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT
function list() {
    var the_list = [];
    for (var i = arguments.length - 1; i >= 0; i--) {
        the_list = pair(arguments[i], the_list);
    }
    return the_list;
}

// returns the length of a given argument list
// throws an exception if the argument is not a list
function length(xs) {
    if (is_empty_list(xs)) {
	return 0;
    } else {
	return 1 + length(tail(xs));
    }
}

// map applies first arg f to the elements of the second argument,
// assumed to be a list.
// f is applied element-by-element: 
// map(f,[1,[2,[]]]) results in [f(1),[f(2),[]]]
// map throws an exception if the second argument is not a list,
// and if the second argument is a non-empty list and the first
// argument is not a function.
function map(f, xs) {
    return (is_empty_list(xs)) 
        ? []
        : pair(f(head(xs)), map(f, tail(xs)));
}

// build_list takes a non-negative integer n as first argument,
// and a function fun as second argument.
// build_list returns a list of n elements, that results from 
// applying fun to the numbers from 0 to n-1.
function build_list(n, fun){
    function build(i, fun, already_built) {
	if (i < 0) {
	    return already_built;
	} else {
	    return build(i-1, fun, pair(fun(i),
					already_built));
	}
    }
    return build(n-1, fun, []);
}

// for_each applies first arg fun to the elements of the list passed as
// second argument. fun is applied element-by-element:
// for_each(fun,[1,[2,[]]]) results in the calls fun(1) and fun(2).
// for_each returns true.
// for_each throws an exception if the second argument is not a list,
// and if the second argument is a non-empty list and the 
// first argument is not a function.
function for_each(fun,xs) {
    if (is_empty_list(xs)) {
	return true;
    } else {
        fun(head(xs));
	return for_each(fun,tail(xs));
    }
}

// list_to_string returns a string that represents the argument list.
// It applies itself recursively on the elements of the given list.
// When it encounters a non-list, it applies toString to it.
function list_to_string(l) {
    if(array_test(l) && l.length === 0) {
        return "[]";
    } else {
        if (!is_pair(l)){
            return l.toString();
        }else{
            return "["+list_to_string(head(l))+","+list_to_string(tail(l))+"]";
        }
    }
}

// reverse reverses the argument list
// reverse throws an exception if the argument is not a list.
function reverse(xs) {
    function rev(original, reversed) {
	if (is_empty_list(original)) {
	    return reversed;
	} else {
	    return rev(tail(original), 
		       pair(head(original), reversed));
	}
    }
    return rev(xs,[]);
}

// list_to_vector returns vector that contains the elements of the argument list
// in the given order.
// list_to_vector throws an exception if the argument is not a list
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT
function list_to_vector(lst){
    var vector = [];
    while(!is_empty_list(lst)){
        vector.push(head(lst));
        lst = tail(lst);
    }
    return vector;
}

// append first argument list and second argument list.
// In the result, the [] at the end of the first argument list
// is replaced by the second argument list
// append throws an exception if the first argument is not a list
function append(xs, ys) {
    if (is_empty_list(xs)) {
	return ys;
    } else {
	return pair(head(xs),
		    append(tail(xs), ys));
    }
} 

// member looks for a given first-argument element in a given
// second argument list. It returns the first postfix sublist
// that starts with the given element. It returns [] if the 
// element does not occur in the list
function member(v, xs){
    if (is_empty_list(xs)) {
	return [];
    } else {
	if (v === head(xs)) {
	    return xs;
	} else {
	    return member(v, tail(xs));
	}
    }
}

// removes the first occurrence of a given first-argument element
// in a given second-argument list. Returns the original list
// if there is no occurrence.
function remove(v, xs){
    if (is_empty_list(xs)) {
	return [];
    } else {
	if (v === head(xs)) {
	    return tail(xs);
	} else {
	    return pair(head(xs), 
			remove(v, tail(xs)));
	}
    }
}

// Similar to remove. But removes all instances of v instead of just the first
function removeAll(v, xs) {
    if (is_empty_list(xs)) {
	return [];
    } else {
	if (v === head(xs)) {
	    return removeAll(v, tail(xs));
	} else {
	    return pair(head(xs), 
			removeAll(v, tail(xs)))
	}
    }
}

// equal computes the structural equality 
// over its arguments
function equal(item1, item2){
    if (is_pair(item1) && is_pair(item2)) {
	return equal(head(item1), head(item2)) && 
            equal(tail(item1), tail(item2));
    } else if (array_test(item1) && item1.length === 0 &&
	       array_test(item2) && item2.length === 0    ) {
	return true;
    } else {
	return item1 === item2;
    }
}

// assoc treats the second argument as an association,
// a list of (index,value) pairs.
// assoc returns the first (index,value) pair whose
// index equal (using structural equality) to the given
// first argument v. Returns false if there is no such
// pair
function assoc(v, xs){
    if (is_empty_list(xs)) {
	return false;
    } else if (equal(v, head(head(xs)))) {
	return head(xs);
    } else {
	return assoc(v, tail(xs));
    }
}

// filter returns the sublist of elements of given list xs
// for which the given predicate function returns true.
function filter(pred, xs){
    if (is_empty_list(xs)) {
	return xs;
    } else {
	if (pred(head(xs))) {
	    return pair(head(xs),
			filter(pred, tail(xs)));
	} else {
	    return filter(pred, tail(xs));
	}
    }
}

// enumerates numbers starting from start,
// using a step size of 1, until the number
// exceeds end.
function enum_list(start, end) {
    if (start > end) {
	return [];
    } else {
	return pair(start,
		    enum_list(start + 1, end));
    }
}

// Returns the item in list lst at index n (the first item is at position 0)
function list_ref(xs, n) {
    if (n === 0) {
	return head(xs);
    } else {
	return list_ref(tail(xs), n - 1);
    }
}

// accumulate applies given operation op to elements of a list
// in a right-to-left order, first apply op to the last element
// and an initial element, resulting in r1, then to the 
// second-last element and r1, resulting in r2, etc, and finally
// to the first element and r_n-1, where n is the length of the
// list.
// accumulate(op,zero,list(1,2,3)) results in
// op(1, op(2, op(3, zero)))

function accumulate(op,initial,sequence) {
    if (is_empty_list(sequence)) {
      return initial;
    } else {
	return op(head(sequence),
                  accumulate(op,initial,tail(sequence)));
    }
}

// set_head(xs,x) changes the head of given pair xs to be x,
// throws an exception if the argument is not a pair
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT

function set_head(xs,x) {
    if (is_pair(xs)) {
	xs[0] = x;
        return undefined;
    } else {
        throw new Error("set_head(xs,x) expects a pair as "
			+ "argument xs, but encountered "+xs);
    }
}

// set_tail(xs,x) changes the tail of given pair xs to be x,
// throws an exception if the argument is not a pair
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT

function set_tail(xs,x) {
    if (is_pair(xs)) {
	xs[1] = x;
        return undefined;
    } else {
        throw new Error("set_tail(xs,x) expects a pair as "
			+ "argument xs, but encountered "+xs);
    }
}
