# RPG Maps

## Assumptions about drawing

### Scaling factor

The output resolution should ideally be 10&times; the input resolution. Changing this ratio will cause drawing to 
appear distorted. If a different resolution is desired for input or output, the corresponding resolution must be scaled.

Possible implications of increasing the ratio is that lines become thin and decreasing it can make lines become thick
because line width is chosen based on the scaling factor. Ideally, geometry is also affected by the scaling factor, but
in order to simplify drawing algorithms, sometimes geometry is tied directly to the input image pixels.
