/**
*  Converts a list, or a pair, to a tree object. Wrapper function.
*/

/**
* @indicator this modification is made for environment visualizer;
* return tree if indicator == "tree"; 
* return counter if otherwise.
*/
function list_to_tree(lst, indicator) {

    // actual function in the wrapper
    function construct_tree(lst) {
        var thisNode = new TreeNode();

        // memoise the current sublist
        perms[counter] = lst;
        // assigns an ID to the current node
        thisNode.id = counter;
        counter ++;
        // if the head is also a list, draw it's sublist
        if (is_pair(head(lst))) {
            // check if such list has been built
            if (perms.indexOf(head(lst)) > -1) {
                thisNode.leftid = perms.indexOf(head(lst));
            } else {
                thisNode.left = construct_tree(head(lst));
            }
        // otherwise, it's a data item
        } else {
            thisNode.data = head(lst);
        }
        // similarly for right subtree.
        if (is_pair(tail(lst)) || is_list(tail(lst)) && is_empty_list(tail(lst))) {
            if (perms.indexOf(tail(lst)) > -1) {
                thisNode.rightid = perms.indexOf(tail(lst));
            } else if (!is_empty_list(tail(lst))){
                thisNode.right = construct_tree(tail(lst));
            }
        } else {
            thisNode.data2 = tail(lst);
        }

        return thisNode;
    }
    // keeps track of all sublists in order to detect cycles
    var perms = [];
    var tree = new Tree();
    var counter = 0;
    tree.rootNode = construct_tree(lst);
    if (indicator == "tree") {
            return tree;
        } else {
            return counter;
        }

}

