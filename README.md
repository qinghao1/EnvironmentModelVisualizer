# CS1010R: Environment Model Visualization #
***
# The Team #
This project was done by Liu Yang (Melody), Qian Peisheng and Le Ba Hieu Giang (Joe), supervised by Prof. Martin Henz and Chen Minqi.

# Getting Started #
1. Clone this repository.
2. Open visualizer_v2.html
3. To test the visualizer: Type commands of the following form into your browser console:

```javascript
   parse_and_evaluate(" // input your Jediscript program here ");
```
```javascript
   var input = parse_and_evaluate("get_frames();");
```
```javascript
   parse_input(input);
```

>`parse_input` returns a pair whose head is the __width__ and tail is the __height__ of the canvas.

Or alternatively, use the pre-defined buttons in visualizer_v2.html

# Supported Features #

### Data Types ###
Our visualizer currently supports __Jediscript__ input of the following types:

+ __Primitives__ 
    + Number, string, boolean.
    + Simply display the value in the table.

+ __Lists __
    + List representation pops up upon mouse hovering. 
    + Credit to Minqi for his list visualizer.

+ __Functions__:
   2-circle representation of functions
    + Left circle displays function body upon mouse click. 
    + Right circle displays the arrow that points to the frame in which current function was defined in.

### Special cases ###

* Multiple frames share the same enclosing frame.
* Call of recursive function.
* Call of functions which were defined in other frames.

### Extras ###

* Highlight the list of frames that lead to a particular frame upon mouse hovering. 

# Unsupported Features #
* Distinction of lists (i.e. whether 2 variables refer to the same list)

# Possible Pitfalls #
Although the size of the stage is adjustable, it is not infinite. And larger stage compromises the general performance. We try to find the balance with our size presets. However there are some possible pitfalls:

* The drawings exceeds stage size.
>A recommended number of frames (that extends the environment model vertically and horizontally) is about 4-5 frames in each direction.

* ~~The list visualization exceeds its container's size.~~
>~~The size of the list visualization can't be retrieved so we have to preset its container to a reasonable size. Overflowing is a possibility.~~

### When these pitfalls happen: ###

* (Mainly) the aesthetic aspect will be affected. 
* The parts of the visualization outside the stage area won't be accessible.
* The visualization engine works as per normal.

# Future Improvements #
* Distinction of lists.
* Dynamic stage size to accommodate every input.
* ~~Dynamic list visualizer's container.~~