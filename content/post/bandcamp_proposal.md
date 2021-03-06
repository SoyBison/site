---
title: "Bandcamp Album Cover Exploration"
date: 2020-03-05T17:45:57-06:00
draft: false
math: true
tags: ['Cultural Patterns', 'Music', 'Color Analysis', 'Statistical Learning']
---


<div id="notebook" class="border-box-sizing" tabindex="-1">

<div id="notebook-container" class="container">

<div class="cell border-box-sizing text_cell rendered">

<div class="prompt input_prompt">

</div>

<div class="inner_cell">

<div class="text_cell_render border-box-sizing rendered_html">

This is an ongoing project, full details are availible [here](https://www.coeneedell.com/projects/bandcamp_analysis/) and on [github](https://github.com/SoyBison/bandcamp-album-analysis)

### How do indie musicians use visual signs to indicate their subgenre?

This exploration will work by gathering album covers from bandcamp.

Running `bandcamp_webtools.py` will generate the `./covers` folder and
populate it with files which use the builtin `pickle` format. Each file
has an album cover, and information about that release. This particular
analysis uses 1100+ albums from 400+ artists, with a total size of \~ 4
GB. For a final project better data management methods are needed. I
will try to write methods which will work at arbitrary scales for today.

`bandcamp_webtools.py` has two main functions, `cowdog` and
`get_album_covers`. `Cowdog` takes in an input bandcamp album and goes
through the recommendation links to find a tree of related albums. Then
it takes the store id for those albums and records it to `artist_tags`.
For this exploration, that input is
<https://chillhop.bandcamp.com/track/velocities>. The point of this is
to discover new bandcamp stores without having to go off of a reference
sheet, or use bandcamp's search function.

`get_album_covers` takes each of the store ids that we gathered with
`cowdog` and goes through that store scraping every album cover in that
store. It also records the artist name, and the tags that the store has
provided for the album. The function stores them in a `./covers` folder
using the builtin `pickle` format. `pickle` is a high efficiency way to
store python objects for later use.

Due to the size of data and the difficulty of webscraping, this
investigation will just look at the "Hip-Hop" genre and an associated
subgenre "Chillhop".

The first thing we need to do is load the album covers into memory.

</div>

</div>

</div>

<div class="cell border-box-sizing code_cell rendered">

<div class="input">

<div class="prompt input_prompt">

In \[133\]:

</div>

<div class="inner_cell">

<div class="input_area">

<div class="highlight hl-ipython3">

    import pandas as pd
    import numpy as np
    import pickle
    import os
    from matplotlib import pyplot as plt
    from tqdm.notebook import tqdm
    import seaborn as sns
    import scipy
    from PIL import Image
    import scipy.misc
    import scipy.cluster
    import struct
    import binascii
    import colorgram
    import colorsys

</div>

</div>

</div>

</div>

</div>

<div class="cell border-box-sizing code_cell rendered">

<div class="input">

<div class="prompt input_prompt">

In \[2\]:

</div>

<div class="inner_cell">

<div class="input_area">

<div class="highlight hl-ipython3">

    data_dict = {}
    for file in tqdm(os.listdir('./covers')):
        with open('./covers/' + file, 'br') as jar:
            try:
                album_info = pickle.load(jar)
            except EOFError:  # One of the files is empty...
                continue
            for key in album_info:
                try:
                    data_dict[key].append(album_info[key])
                except KeyError:
                    data_dict[key] = [album_info[key]]

</div>

</div>

</div>

</div>

<div class="output_wrapper">

<div class="output">

<div class="output_area">

<div class="prompt">

</div>

<div class="output_subarea output_stream output_stderr output_text">

    100%|██████████| 1142/1142 [00:42<00:00, 26.58it/s]

</div>

</div>

</div>

</div>

</div>

<div class="cell border-box-sizing code_cell rendered">

<div class="input">

<div class="prompt input_prompt">

In \[4\]:

</div>

<div class="inner_cell">

<div class="input_area">

<div class="highlight hl-ipython3">

    data = pd.DataFrame.from_dict(data_dict)

</div>

</div>

</div>

</div>

</div>

<div class="cell border-box-sizing text_cell rendered">

<div class="prompt input_prompt">

</div>

<div class="inner_cell">

<div class="text_cell_render border-box-sizing rendered_html">

</div>

</div>

</div>

<div class="cell border-box-sizing code_cell rendered">

<div class="input">

<div class="prompt input_prompt">

In \[20\]:

</div>

<div class="inner_cell">

<div class="input_area">

<div class="highlight hl-ipython3">

    def make_colorgram(image_array, n=6):
        img = Image.fromarray(image_array)
        cs = colorgram.extract(img, n)
        cs = [[color.rgb for color in cs]]
        return cs  # This code uses the colorgram package to get the 'dominant' colors from each image.

    cgrams = []

    for cover in tqdm(data['cover']):
        try:
            cgrams.append(np.array(make_colorgram(cover, 4)))
        except TypeError:
            cgrams.append(None)

    data['cgram'] = cgrams

</div>

</div>

</div>

</div>

<div class="output_wrapper">

<div class="output">

<div class="output_area">

<div class="prompt">

</div>

<div id="b228b382-5800-494b-a116-27d44434a8d8">

</div>

<div class="output_subarea output_widget_view">

</div>

</div>

<div class="output_area">

<div class="prompt">

</div>

<div class="output_subarea output_stream output_stdout output_text">

</div>

</div>

</div>

</div>

</div>

<div class="cell border-box-sizing code_cell rendered">

<div class="input">

<div class="prompt input_prompt">

In \[25\]:

</div>

<div class="inner_cell">

<div class="input_area">

<div class="highlight hl-ipython3">

    with open('data_store.pkl', 'bw') as f:
        pickle.dump(data, f)

</div>

</div>

</div>

</div>

</div>

<div class="cell border-box-sizing text_cell rendered">

<div class="prompt input_prompt">

</div>

<div class="inner_cell">

<div class="text_cell_render border-box-sizing rendered_html">

The code above uses the `colorgram` package to decompose each image into
4 dominant tones. Those are then stored as rgb arrays in the data frame.
I then pickled it for safe-keeping.

</div>

</div>

</div>

<div class="cell border-box-sizing code_cell rendered">

<div class="input">

<div class="prompt input_prompt">

In \[28\]:

</div>

<div class="inner_cell">

<div class="input_area">

<div class="highlight hl-ipython3">

    data = data.drop('cover', axis=1) # For ram reasons.

</div>

</div>

</div>

</div>

</div>

<div class="cell border-box-sizing code_cell rendered">

<div class="input">

<div class="prompt input_prompt">

In \[120\]:

</div>

<div class="inner_cell">

<div class="input_area">

<div class="highlight hl-ipython3">

    def get_tag_cols(tag):
        tagged = data.iloc[[tag in tags for tags in data['tags']]]
        cols = tagged['cgram'].reset_index(drop=True)
        return cols

    chill_cols = get_tag_cols('chillhop')

</div>

</div>

</div>

</div>

</div>

<div class="cell border-box-sizing code_cell rendered">

<div class="input">

<div class="prompt input_prompt">

In \[171\]:

</div>

<div class="inner_cell">

<div class="input_area">

<div class="highlight hl-ipython3">

    def brightness_plot(cols, tag):
        brightnesses = [(0.299*r + 0.587*g + 0.114*b)  for gram in cols for col in gram for r, g, b in col]
        brightnesses = np.array(brightnesses)
        rs, gs, bs = zip(*[[r, g, b]  for gram in cols for col in gram for r, g, b in col])
        
        sns.distplot(brightnesses, color='black', hist=False)
        sns.distplot(rs, color='red', hist=False)
        sns.distplot(bs, color='blue', hist=False)
        sns.distplot(gs, color='green', hist=False).set_title(f'Brightness plot for {tag}-tagged album covers.')
        plt.show()

</div>

</div>

</div>

</div>

</div>

<div class="cell border-box-sizing code_cell rendered">

<div class="input">

<div class="prompt input_prompt">

In \[172\]:

</div>

<div class="inner_cell">

<div class="input_area">

<div class="highlight hl-ipython3">

    def luminance(color):
        r, g, b = color
        return 0.299*r + 0.587*g + 0.114*b

    def col_plot(cols, tag, size=48):
        colors_unorganized = np.array(sorted([col for box in cols for img in box for col in img], 
                                             key=lambda rgb: colorsys.rgb_to_hls(*rgb)))
        colors_unorganized.resize(size * size * 3)
        colors_unorganized = colors_unorganized.reshape((size, -1, 3))
        colors_unorganized = colors_unorganized
        plt.matshow(colors_unorganized)
        plt.title(f'Color Plot for {tag}-tagged album covers.')
        plt.show()

</div>

</div>

</div>

</div>

</div>

<div class="cell border-box-sizing code_cell rendered">

<div class="input">

<div class="prompt input_prompt">

In \[177\]:

</div>

<div class="inner_cell">

<div class="input_area">

<div class="highlight hl-ipython3">

    hhcols = get_tag_cols('hip-hop')
    lfcols = get_tag_cols('lo-fi')


    col_plot(chill_cols, 'chillhop', 49)
    col_plot(hhcols, 'hip-hop', 25)
    brightness_plot(chill_cols, 'chillhop')
    brightness_plot(hhcols, 'hip-hop')

</div>

</div>

</div>

</div>

<div class="output_wrapper">

<div class="output">

<div class="output_area">

<div class="prompt">

</div>

<div class="output_png output_subarea">

![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARYAAAEMCAYAAAABAJmyAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAADh0RVh0U29mdHdhcmUAbWF0cGxvdGxpYiB2ZXJzaW9uMy4xLjMsIGh0dHA6Ly9tYXRwbG90bGliLm9yZy+AADFEAAAgAElEQVR4nO3deXgV1fkH8O8LJAQIEEIAWU1FFBCUVVyoooKKIlqrPxdQ3K1LXXFBrSIuKLVWW7fauuC+gYKoFUHB4oJGQUEWEYyyhCVAJAECIby/P2Zi79xt7nLmJJd+P8+TJ3fOzJzz3rmTNzPnnpkRVQURkUn1ajsAItrzMLEQkXFMLERkHBMLERnHxEJExjGxEJFxgSYWERkkIquCbCOkrWdF5G6D9d0tIqUistZUnTHaGSsiL8SZ/52IDApfVkQKRURFpIE7PUtELgoy1kyQznZwt+e+7muj+9P/moQSi4icLSJFIlIhIiUi8p6IDAw6uChxzBKRSjeOUhGZLCJtU6jn1x0oxvyOAK4H0F1V90on5nSp6gGqOqs2YwgnIsUiMri246C6yzexiMh1AB4CcC+ANgA6AXgMwMlBBiYi9WPMulJVcwHsByAPwF8DaH5vABtVdX2yK9YcQRBlKhP7cNzEIiLNAYwDcIWqTlbVrapapapvq+oN7jINReQhEVnj/jwkIg1j1NfNPeoocw/xh4fMe1ZEHheRd0VkK4Cj4sWmqpsATALQI0ZbF4vIDyKySUSmikg7t/xjd5Fv3COfM8LWGwzgAwDt3PnPuuXD3ZjL3PfQLWSdYhG5SUS+BbA12gcjIgeIyAduPOtE5JaQ2dki8pyIlLtt9AurO9Gjg71F5BO3nukiUhBSj1/8Y0RkkYhsFpFnRCQnxnZ9Hs4/l7fd7XOjW/66iKwVkV9E5GMROSBknZYi8raIbBGRL93TzDkh848VkaXuuo+JyOzQ0xkRuUBEFruxvS8ie4fMGyIiS9x1HwEgsTaOiBwsIp+526BERB4Rkew427PA/czK3Zj2duvxnIa6Zb+egonIee7n8Fe3rRUicphbvlJE1ovIqDhx5rufwRr3Pb8VMi/Wfv2EiDwQVs8UcQ4MICLtRGSSiGwQkR9F5KqQ5caKyBsi8oKIbAFwnrutitzPbJ2IPBhnO0VS1Zg/AI4HsAtAgzjLjAPwOYDWAFoB+BTAXe68QQBWua+zAPwA4BYA2QCOBlAOYH93/rMAfgFwOJyElxOlrVkALnJfFwD4EMDzIevf7b4+GkApgD4AGgL4O4CPQ+pRAPvGeU+/xu1O7wdgK4Ah7vu40X0v2e78YgDzAXQE0ChKfU0BlMA5vcpxpwe488YCqARwAoD6AMYD+Dxk3WIAg0OWfcF9Xei+jwYh22a5G2sjd/q+JOJf6MafD+CTmm0ZY/v8GlNI2QXu+2oI5wh3fsi8V9yfxgC6A1gJYE7I57gFwKkAGgC4GkBVyOd8ihtrN3f+bQA+DVv3NPd9XQtnf70oRtx9ARzi1lMIYDGAa6LtF3D2p3IAR7jv6eGQmD3bPsq+eZ4bx/nuZ3o3gJ8BPOrWdaxbd26MON8B8CqAFu77OtJvv3bjXAlA3OkWALYDaAfn7+krALfD+dvbB8AKAMeF7FdV7rauB2f/+QzAOe78XACHxMsVEe/BJ7GMALDWZ5nlAE4ImT4OQHGUxPJbAGsB1AtZ9mUAY0M+yOd82poFYBuAMgCrAbwIoFWUxPIUgAkh6+W6G64wxcTyJwCvhUzXc9sfFPKHdkGc+s4CMC/GvLEAZoRMdwewPcXEclvIepcD+HcS8f8hZP4JAJYnk1jC5ue5sTWH84dVBfcfiDv/bvz3j/RcAJ+FzBM4fyA1f6TvAbgwLPZtcE5Xz4U3CQuAVYiRWKLEeQ2AN0OmwxPLK2H7UDWc5OvZ9iHbPzSxLAuZ19Ndvk1I2UYAvaLE1BbAbgAtosyLuV+77/1nAEe48y4G8KH7egCAn8PqGgPgmZD96uOw+R8DuBNAQSLbMvzHr49lI5zDwXjnXO0A/BQy/ZNbFm25laq6O2zZ9iHTK33iAYCrVDVPVdur6ghV3eAXk6pWwHkv7aMsm4jw+na7sSYae0c4CTiW0G+etgHI8dnmidaT675ONv5fP0NxOuor3J8R0RoVkfoicp+ILHcPpYvdWQVwjmIbhNUf+rpd6LQ6e3XoN4l7A3jYPaUoA7AJzh9R+xjrxvwcRGQ/EZnmnrJtgdNvWBBr+bC6K9y2o+3b0awLeb3drSO8LBeROgLYpKqbo8yLuV+77/0VOP/EAOBsOP94AWcbtqvZhu52vAVOn2mN8O12IZwj3SXu6euwmO80Cr/E8hmcw/RT4iyzxg28Rie3LNpyHUWkXtiyq0OmTV1q7YlJRJoAaBnWVjr1CZwdINHYVwLonGLbJiQSf8eQ179+hqo6VFVz3Z+aHTX8vZ4NpzN/MJyjlMKapgBsgHNa0CFGWyWh89zYQpddCeBS959JzU8jVf3UXbdj2LqhdYd7HMASAF1UtRmcP66YfTJhdefCOU1cA+e0EnBO7WqY+vZwJYB8EcmLMs9vv34ZwGluX9AAOH2QNXX+GLYNm6rqCSF1ez5TVV2mqmfB6eK4H8AbbnsJiZtYVPUXOOdlj4rIKSLSWESyRGSoiEwIeTO3iUgrcToLbwcQbVzGXDgfyI1uHYMAnAQny5r2EoDzRaSXOB3J9wKYq6rF7vx1cM4zE/UagBNF5BgRyYLTV7IDTn9SIqYB2EtErhGns7upiAxIov10JRL/FSLSQUTy4fzBvRqnvvDt19StbyOcP7Z7a2aoajWAyQDGuvtPVzinMDXeAdDT3b8aALgC3j/SJwCMEbczWESai8jpIeseICKnuutehfh/4E3h9MlUuHFcFmdZADhBRAa6Hbx3wdmHVrpHyasBjHSP1i6AoX8cqloC5/TvMRFp4f6tHOHOjrtfq+o8OIn8XwDeV9Uyd70vAGwR5wuGRm7MPUSkf6w4RGSkiLRyj25r6qlO9H34ft2sqg8CuA5Op9kGONnvSgA1PdV3AygC8C2ABQC+dsvC69kJYDiAoXA6oB4DcK6qLkk02ESp6kw4/QqT4PxX6wzgzJBFxgKY6B4W/l8C9S0FMBJOZ1kpnIR4kvueEomnHE7H6UlwTleWwedbL5MSjP8lANPhdOqtQJTPMMR4OP9MykRkNIDn4ByirwawCE5nfqgr4RzJrAXwPJx/Rjvc2EoBnA5gApzE1B3O/lQz/004/zFfcU9fFsLZh0LXvc9dtwucjudYRsM5uioH8E/ET56As03ugHMK1BdOn2ONiwHc4LZ7ABL/J5OIc+D0nSwBsB5OX1Ai+zXgbNvBbuxw16uG85n3AvAjnH3gX3A+k1iOB/CdiFTA6bg+U1UrAcA9Lf5t3HeQSsdMuj9u0Evh9PbfXBsxJBDj0+6HujCkLB/OV9HL3N8RHWy1/QPn8P0jON94fAfgar/Y4dMZG0CM9wOYGDKdA+e/6jduzOVwEm8mbO/6AOYBmJYp+4iNH+vXCokz8O1ROP91ugM4S0S6244jAc/CSYChbgYwU1W7AJjpTtc1uwBcr6rd4Hy1eoW7fWstdhHpKiIHiuNgOB2Db4YsciSA3wE4GM5RREM434xkwva+Gk4Sr5EJMQevFjL8oXDO/2qmxwAYU9sZNkashfAesSwF0NZ93RbA0tqOMYH3MAXOaVjM2BHwEQuA/nCOTre5bY2BO97CnT8WzilFOYAv4ZwCDKjr2xtOJ/NMOONLao5Y6nTMtn5qY/h5e3i/2loFZyfKBG3U6VyDqpaISOvaDigeESkE0BtOx3nM2FW1MMg4VPVLADGvzVLVsSJyF5xBXN0APKqqc0Wkrm/vh+AMNmwaUlbXY7aiNm6bEO3rPVNfM5PL/Xp0EpyRpVtqOx4/qlqtqr3gHAUcLCJRL9WoK9xxHetV9avajqUuqo3EsgresQYdEH3cS120Ttyrqd3fSV+kaIP7lfIkAC+q6mS3OCNiV+cr0llw+rfqcsyHAxguIsVwhkwcLc4tLepyzNbURmL5EkAXEfmNOz7gTABTayGOVEwFMMp9PQpO/0Wd4g4SewrAYnWGCtSos7G7Y6Dy3NeN4HxdugR1OGZVHaOqHdzTyDPhDJ8fiTocs1W11Ol1AoDv4Qxzv7W2O5pixPgynLECVXCOsi6EM8pxJpyvEmcCyK/tOKPEPRDOqeW3cC6MnO9u7zobO4AD4Xxl+y2ccSq3u+V1Nuaw+Afhv523GRFz0D81V0ISERnDe94SkXFMLERkHBMLERnHxEJExjGxEJFxtZZYROSS2mo7HZkYdybGDGRm3JkYcxBq84glUz+ATIw7E2MGMjPuTIzZuLQTi4gcL86jG34Qkf/NS8SJyCOtAXLuvVW+h3NZ/io4w/XPUtVFcdZREXFG50m8242mr379WM88S93u3btRr170fNy0adOo5UFo3jzezb+8ysvL044tNzfafZ+DkZWVBQAoLS1FQUG8e12bEevzTMWGDRvQqlWrmPNLFi4w1pafHWH7f8WOnajctSvYPzpXurdNOBjAD6q6AgBE5BU4N1WOl1h+3XGC1iIv2v2Ig3PU0Udba+v448PvQRWsgQPtPVG3TWu7dxpoYjFp3tXlN9baWpGX75mettj4XWBjSjdVR7u3SsQjNkTkEnGeqlbESwiI9nzpHrEkdG8VVX0SwJMAUK9ePWYWoj1cuokl6Xur5DfKwbBuXdNsNroRo28IpN5ojvnhu5TW6zMxtaedzBh+jGd607QXYywZjGlPPOC/kCHn7x2lj+LvQTwlxlFeud0z/dSpxwXWVtO2LSLKGjUMpmsg/ITyo/pWulcApH8qlMn3ViGigKR1xKKqu0TkSgDvw3kMwtOqmtq/ciLaY6R9M21VfRfAuwZiIaI9hPUbPfXMa6JTj7DzGKFN7ex9tQcAWfvs77tMy5zswNpv1KqN7zLLpwd3pnr2R/bGaFzbv5u1tgDg7YXfW2trzYbSQOpdVrYV23ZVW+lo4UWIRGQcEwsRGcfEQkTGMbEQkXHWO297Nc/RmQP3Tnq9hr0PCyCa6KZ8t9xaWwBwWL2tnummhx4TY8lglDVt6bvMqnqNLETi+HrGexFlQw/07xivWDwviHCi6tipo/9CBi36dHbS6+y8/H7P9FVjbsP3y1ew85aIMhMTCxEZx8RCRMalPfI2Wcu2V2PogrLkV1zgP7j3zN5dUogoNYMGDYooe/eL+b7r3ft6AoOUp5jpKxh1QmRfTdOW0W5CtMpIe+HOPrxXSusdPeSoiLIdCaw3c8HilNpLxR+amL+JWDzzGse+eVQsQ36Y45nOqqwwFY4vHrEQkXFMLERkHBMLERnHxEJExlkfIHdA+9b68hWnBVL35Y+9FEi90bxy2SnW2gKA0mYRtxL2taNe5J3J9q0oNhBNYlbXj3ySwBvfb0yprinT3kk3nITNuviIiLLdLTtYa196RLZvwtGX3YL5S5dzgBwRZSYmFiIyjomFiIyzfxHi/p31w8fv9ZStWRbz+WbGjbzn8Yiyy3v733nNlG+yOwVW912/2RJY3eE2tfK/KDBVC7781Eg9ExZXG6knUYMP7GytrXHPJX8nwP4DBqCo6Cv2sRBRZmJiISLjmFiIyDgmFiIyznrnbb9+ffXLuXOTXu9PZ9i7q9rVt95prS0AOP3Cyz3TL44+M2KZb3dEDjYzpdNme4/taJfj36F66lPJ7x/p2IqG1to6ZL921tpq2DjXM/38lA+wtnQTO2+JKDMxsRCRcUwsRGQcEwsRGWe983avgnw95+QhadczelDk1aZvv2Pv2fTnDk7ttov/zom87WJQmuxM7Uril97/zHAk8TUL7nHWEcbeNsZaW5UfPRJRtjmRe2wacsoE799D8YZyVO7cxc5bIspMTCxEZBwTCxEZZ72PJSe7gRa2ahp3mYX3HGspGscfp2+31taEa0ZYa+vOR5631hYA3HPLtYHV/eX8hUmvc+34fwQQiWP4MYcGVnc0J/7+7LTrGHnh5Vi0ZCn7WIgoMzGxEJFxTCxEZFxCiUVEnhaR9SKyMKQsX0Q+EJFl7u8WwYVJRJkkoc5bETkCQAWA51S1h1s2AcAmVb1PRG4G0EJVb/Krq3vX/fWFpx6Lu8wVZx6XSOzG9B042HeZ7GzvKK7hh9i7DSEAXHa/99Emu7ObpVRPw4apXcmbk2Xv4Lawo70rgAGgc6PN1traf/D51tpq3WiXZ/rqP03AshU/153OW1X9GMCmsOKTAUx0X08EYPdBO0RUZ6Xzb6iNqpYAgPu7tZmQiCjTWTm+FZFLRKRIRIo2l5XZaJKIalGDNNZdJyJtVbVERNoCWB9rQVV9EsCTANBln066tnhx3IpnFyU/GCodn059ylpbKvUjyvoPOtF3vRNnJ39Xta/nzY8s3Jl0NQmvN+NcUwMN/e9oV3XZT4baSsz818eZqai6yHeR88Yn/2iPRKwqsdeXlM4Ry1QAo9zXowBMST8cItoTJPp188sAPgOwv4isEpELAdwHYIiILAMwxJ0mIkrsVEhVz4oxy94drokoY3DkLREZZ/3q5kYNs7SwrXeQ7tsT/2Kt/X1a2sul8ww9gxgA3pr+ibG6/Iw8vre1tgBge1Yrz/Swa4K7Kjmai0+y936v+kPkALmSxXM8092G3RCxzA8/r0u77VPPvhgLFi2pOwPkiIiSwcRCRMYxsRCRcdb7WHp276qTX/qnp2zJ0u+ttX/8Sb+31pZsij8QsMa6TRVJ133GaXYvzfposrffo2xn5K31C3oOsxUOqn98L6KsZ5S+iUQ8N+6MdMMBALw83Tuwb/wdo43Um6jdLQ6IO//wI4fg63nz2cdCRJmJiYWIjGNiISLjmFiIyDjrnbd9evfST2Z/kHY9pT99YyCaxOU3y/FMN1qe2hXR839MvqM2VV36Rt6J76Pv7f0v6bZ7ZkTZxsqcKEsGo2RX5GN4g/Tbo4emtF6Lkon+Cxkw4MJJKFqynp23RJSZmFiIyDgmFiIyjomFiIxL59aUKZHKdWiw9OG062neclBEWdW6LzzT35dURyxzzV32nmf81JiDI8qym6b2+I1EdD52vO8yQwrNtDXj9T/7LrMELc00BqD/oNOSXqcwxbaOPDa10dn9pn+VYovJe3Dc5UmvU9VgRgCRRMcjFiIyjomFiIxjYiEi46wPkDuoRxed/kbyfSyVyAsgGoeIlTFDAIDmbfa31lbuxknG6pr7hf9jK0zpdsRlKa1XPMe/j8mUdv2v9l1m3bxHLUTyXwW9r407f+jJ5+KbBYs4QI6IMhMTCxEZx8RCRMYxsRCRcdYHyEGyUJ3dOunVssKrUf+HCTesvyPpdgCgSpr7LvPdJ/ae9wwA+/VO/raP5Yi8ulcbpNYJ3rFfj6TX2bY9te2/fmNZSuu17he/8zIWQeRASj/VCXzpUdAr+UFsiYr+fYN3e1dWeZ8TvtviFzU8YiEi45hYiMg4JhYiMs56H8tuVeyo2mWgpsicGD7QbUd14xTrrvJdos/gq1Kqef3an1Nab1tYSMcNvyClelI1cOBAa23dedsfU1pvR9XulNbLiXySia/s0idTaitVvzQZmX4lmnxfUqp4xEJExjGxEJFxTCxEZBwTCxEZZ/8OcrIbWSkOXPNTtdveoyXKfvklpfWyG/kPvotmyaJ5nunHH74tpXpGnJfaILJ335mS9DpfffFRSm3ZtjOBPs2P/hP+uJnDA4kFAI4d1DWizMSeXa+eveMIHrEQkXFMLERkHBMLERmXUB+LiHQE8ByAvQDsBvCkqj4sIvkAXoVzQ/RiAP+nqpvj19UA9bJbpBNzTBPuvNkzffKQ9oG0E8u/P1xsra3/zE1toF1hp4KU1nvjteQfA6q7t6XU1nfzp0eUDen5n5TqSsVz/25lrS0AOOGUK8JK/C+wTcTO6iae6d2wd6fERI9YdgG4XlW7ATgEwBUi0h3AzQBmqmoXADPdaSL6H5dQYlHVElX92n1dDmAxgPYATgZQ869sIoBTggiSiDJL0n0sIlIIoDeAuQDaqGoJ4CQfAFFvtCIil4hIkYgUbdwU90yJiPYASSUWEckFMAnANaq6JdH1VPVJVe2nqv1a5gfTv0JEdUfCj/8QkSwA0wC8r6oPumVLAQxS1RIRaQtglqrGfb5Fz57ddOrkp9MMG8jKbuK/kEFZZd4BaQXd/mm1fWz7wFpTo8c8Zq0tALh6dPqP3E3U+HtGW2vr1lsjuxy/+a7cWvsdOnjvIDhi5AVYtGhJ3Xn8hzj3I3gKwOKapOKaCmCU+3oUgOSHZxLRHifRIf2HAzgHwAIRme+W3QLgPgCviciFAH4GcLr5EIko0ySUWFR1DhDzS/BjzIVDRHsCjrwlIuOsP7u5e/eu+uIL6XfeRpPffKOReirKVxupJ1H7dPR2Tb06ObURq6nKbW5mpOe116/0TLdv385IvYkaM+Y0a2317HlkRNneex8UVmL/6TrxDBgwAEVFX9WdzlsiomQwsRCRcUwsRGSc9T6Wfv366ty5cz1lv5Qv8Ezfcef1NkPCReffY62tKvk6oqy6uqGRundutXc194df3WCtLQC48txpnunbH/yt1fY/f6+Ztbays1N4HkkCFnyzFBUV29jHQkSZiYmFiIxjYiEi45hYiMg46523ubmNtedB3gugW+2z3jMtOXbv2fL0g4s800OPHx6xzEHXmelgTcTQvKsjyvZtf4C19s+/6PyIsremvpV0PZOmvmEiHADAwOMPNVaXn7/c9PeIsoVLF1prv/in4kDq3Va6HdVV1ey8JaLMxMRCRMYxsRCRcdb7WOpn1dfGBY08Ze++/65netT/nWcxIqBeCvm182GdfZd5ZPwjEWUj/3Jx0m1Fc8txkYMIm3bMM1J3NBeMiOx3SUXFmoTvaOpx8HHBPdI03OAhQ6y1BQD/uOtvVtr56cdiVG6vZB8LEWUmJhYiMo6JhYiMY2IhIuOsd97mF+TrMScd5yl7+lF7j9K4aaadjjIAeO2Sh6y1BQB3P/JnI/WMnzAhokwrd3mmX3hnkpG2EnXr/Xd5pp/4U2SMf7zX+4iWO669KdCYwl3/9/HW2jr38KFJr/PADbfj5x9WsPOWiDITEwsRGcfEQkTGWe9j6bTvPjr6z+M8ZX9dMN1a+3ecckFgdV8yKPLixaDc//TjEWUHHRR+l/jU9G/zGyP1JOqJD6daa2tL61zfZYrG/8tCJP9V1a2TlXa+eOZVbClZzz4WIspMTCxEZBwTCxEZx8RCRMZZ77zNatFM8wcd4inr03k/7/RxgwNrf/HsTwKrO9ypR0W+j9eeftZa+7+/8VprbQHAlaO9jwQZd4+9AWMAMO6xR621dd1Jp1hrCwB6HdQr7Tqu+92pWLZgATtviSgzMbEQkXFMLERkHBMLERlnvfO2S8+e+uCbk+Muc/IDT/jW06yd3dGh+5WssNbWqqLPrbUFAH17eTsG+wy1N4IYAH5YtcZaW41zm1pra/SwYwKru/vhgyLKupwef1R58TN/QWXJSnbeElFmYmIhIuMSSiwikiMiX4jINyLynYjc6Zbni8gHIrLM/d0i2HCJKBMk1MciIgKgiapWiEgWgDkArgZwKoBNqnqfiNwMoIWqxr1tV5v9D9CzH3vFQOj+Omyxd+4OADdcdZW1tvL6DrLWFgA0zfW/KtiUq087wVpbAHDjPWbuvJeIGZPs7PsAcM7l13im182Zhp1lpXWnj0UdFe5klvujAE4GMNEtnwjA7nBEIqqTEu5jEZH6IjIfwHoAH6jqXABtVLUEANzfrYMJk4gyScKJRVWrVbUXgA4ADhaRHomuKyKXiEiRiBRtL9ucSpxElEGS/lZIVcsAzAJwPIB1ItIWANzf62Os86Sq9lPVfo3y2L9LtKdLtPO2FYAqVS0TkUYApgO4H8CRADaGdN7mq+qN8erKzivQNgOHecrefyLyUQ5BufqOewOr+4sZ7/ovZEj/4WdZawsAVpSU+i7TdO1iC5E4WnfuZq0tAFie6/+sblO2vfePQOrduPonVO2w8+zmBgku1xbARBGpD+co5zVVnSYinwF4TUQuBPAzgNMDipOIMkhCiUVVvwXQO0r5RgDBjVsmoozEkbdEZJz1ixAbN22mXXsfnPR6/fr1CyCa6G4fe6e1tgDgTzODucBxw6zXAqk3lp3lZdbaajzsGt9l3r3PfxkAOOvQ/dMNJ2HvTX7VWlsNmjT3TJcWf4+dldvqzgA5IqJkMLEQkXFMLERkHBMLERlnvfM2O6exFhTu579gCiq3bQ2k3mja5Nm72hcAnpkyI7C6Z3y5yDP92bTUrsBdULzOd5mrbrkrpbpTsbkq0WFaZiz+paG1tmbenfwAyYrib1BdWcHOWyLKTEwsRGQcEwsRGWe9j6V+Tq7mFh6U9HonDDrUSPt9BxweUfa3Rx4zUnciOg442VpbIwfYvT3O2H+8Za2tVrv9+3OiOXHE5b7LdGqRlVLdqRrzrJ3H/m79YiKqt6xlHwsRZSYmFiIyjomFiIxjYiEi46x33rbttK+ef9MDnrKCnF2+691yz8NBhRRh0qRJ1toCgHeX+ef3n9+6Lel6ux93aSrhpOyVd7ydkCWlFRHL7L3W3uMvsn97R0LLbZ7hXa5hk7wgwgEAjLr+Af+FUvTqA3+IO7/4hyXYvp1XNxNRhmJiISLjmFiIyDgmFiIyznrnbaNGjbVw366eso6F+1pr/6Oi5RFlzz8VzMjbiS++bqyuxyfc7Jk+9db3jNUdbuOXT/ou0wBVEWX7dO7imd7UyMxo6WhGHFUQUdb3kKN817v03OERZZU7/L88MOWZFyZHlPXr1tJK20ceMRBff/01O2+JKDMxsRCRcUwsRGSc9T6WPn366OyP51hpa9SlN0eU/bQt8lGZu7La2wgHANBaFvkvlKK1y8LuMtc4uMeCrl8+M7C6o8nL8x+01qX7IZ7pbxcEt62j6djbO0Bt+ZyxVttv3/nIuPOXzJuCreWl7GMhoszExEJExjGxEJFxTCxEZJz1ztsmTQu0a+/0b8/YtW/k4w/+/dJladebqLyOJwVWd5u8ysDqjqZ1fn3P9Nw5U6y2n5Xd2Fpbs2fPttZWn0PPCKzuw8ge87YAAAXhSURBVIc9kvQ6c948A2UbvmPnLRFlJiYWIjKOiYWIjLPex5LX6gAd+LtXk16v2XZ7j+j4Zt5n1toCgO59RnimFxQlv33SsfGXFr7LtGjVx3eZqvLpJsJByZofjdSTqGYtf+u7zCmnXuiZXlMceTFhIlaV2Hvsa8Oscs/0wm9nYGvFJvaxEFFmYmIhIuOYWIjIuKQSi4jUF5F5IjLNnc4XkQ9EZJn72/9knYj2eEl13orIdQD6AWimqsNEZAKATap6n4jcDKCFqt4Ur44mufna48DBaQUdy+rVawKpFwBatjrQM12y6tPA2oqmVUGukXr22fd4I/UkYlNpUUrrff5lo4iy4ScN9ExPmXxtSnWnqk0b793wGjSojrLMbs90u3aFQYYUoZ7PYcKsWe+jrGxj3eq8FZEOAE4E8K+Q4pMBTHRfTwRwirnQiChTJXMq9BCAGwGEpuU2qloCAO7v1gZjI6IMlVBiEZFhANar6lepNCIil4hIkYgU7arakUoVRJRBEupjEZHxAM4BsAtADoBmACYD6A9gkKqWiEhbALNUdf94deXltdRBg45LO/Bjh1ySdh2x/PWvYyLK+vc71kjdPbpFXjz5wisXJF3P6tUrTYSTsOptXf0XMuQPF90ZUfbxnOQHpFXV+9pEOACAE44J7gLXJ54M7rGroX6pXIhd1VvrTh+Lqo5R1Q6qWgjgTAAfqupIAFMBjHIXGwXA7mWxRFQnpTuO5T4AQ0RkGYAh7jQR/Y9L+sIFVZ0FYJb7eiOAY8yGRESZjiNvicg461c379Vyfz3nxPiP8PzhZ/+ri6XxTxFlC5bauztYVmVqj4XtP6BHSuuVrNzsu8xdt9yWUt2paLBzt/9CBlVt2GqtrVHjfm+tLQCon+39Gzx932Da/+dXT2FN+Zq603lLRJQMJhYiMo6JhYiMY2IhIuOsd962a9pOL+7rvc3fLwVbPNPndzrHZki4/tUbkl5nZ36VsfZv7WHvSt3X337dWlvzA3xOdTQnDT0xpfWGHzvMcCSOS/98lbG6Nm/c5Jl+9NrkR+te+diN+H71cnbeElFmYmIhIuOYWIjIOOt9LIWtO+kdZ4xOer25pd96ph9/4nFTISXkovMv9F8ozJ9vvDui7NF/RD7G5LnZb3imLz4ocoBUg027PNMr2m2JWGbWpx97phtn5SQUpymH9TrYMz3rW7uPUam/20r3AQBg4IDDrLUFAFVfrE67jjdWzsH6yjL2sRBRZmJiISLjmFiIyDgmFiIyznrnbeucPD2to/dRDh+VLbTW/vzZc621deMdt1hrCwDmfW9vO24sLTVW17iH7jdWl5/Wyyt9l5n0+QcRZc222Luau3Vlas93Hjwk/q2RTvvn7Vi4ZgU7b4koMzGxEJFxTCxEZJz1PpYe7fbRNy4e5ynruL2+tfZvf/MJa20deuvF1toCgCY53keTfvEvexccAsBVpwd38ei9770cWN3hjh1xmrW2AKDbQu8Fhqc/NyGQdhasKUbFjkr2sRBRZmJiISLjmFiIyDgmFiIyznrnbW7DHO3ZrtBTtnb9OmvtTx5r5zm5AHDFQ/dGlB3Wt5+19if87aGIsi+nvGet/S6v/yel9Zr/MfL51pc8+0i64SSs/fZqa20BwAXNO3qmn86u8F3nta+Sv3K8ePUqVO7Ywc5bIspMTCxEZBwTCxEZZ72PJadhQy1s3yHp9W4f+rsAoomuQ6eOEWW/edv/8a3VbVp6phtsS+2xoEVH2euHAYC8ogW+y+zVvWtg7c94xP9ugEMu9d7Bb92SpUGFE1W3/sF9Jqc9bKff7+vS9Siv2sk+FiLKTEwsRGQcEwsRGcfEQkTGWe+8FZENAH4CUADA3G3I7MnEuDMxZiAz467LMe+tqq1sNGQ9sfzasEiRqtr9+sOATIw7E2MGMjPuTIw5CDwVIiLjmFiIyLjaTCxP1mLb6cjEuDMxZiAz487EmI2rtT4WItpz8VSIiIxjYiEi45hYiMg4JhYiMo6JhYiM+3+fio9+1kVTGAAAAABJRU5ErkJggg==%0A)

</div>

</div>

<div class="output_area">

<div class="prompt">

</div>

<div class="output_png output_subarea">

![](data:image/png;base64,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%0A)

</div>

</div>

<div class="output_area">

<div class="prompt">

</div>

<div class="output_png output_subarea">

![](data:image/png;base64,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%0A)

</div>

</div>

<div class="output_area">

<div class="prompt">

</div>

<div class="output_png output_subarea">

![](data:image/png;base64,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%0A)

</div>

</div>

</div>

</div>

</div>

<div class="cell border-box-sizing text_cell rendered">

<div class="prompt input_prompt">

</div>

<div class="inner_cell">

<div class="text_cell_render border-box-sizing rendered_html">

For reference, the Color plots show the dominant colors of each album,
which have been sorted by Hue, Luminosity, and Saturation, and then
arranged in a square. This is a good, at-a-glance way to compare
palettes. The brightness plots show the distribution of four values. The
red line shows the distribution of red-channel colors in the dominant
color charts, green for the brightness of the green channel, and blue
for the blue channel. The black line shows the brightness according to
the quick-luminosity formula:

\$\$ 0.299r + 0.587g + 0.114b \$\$
The biggest trends we see are that albums tagged as 'chillhop' favor
pastels, we see almost no vibrant colors in the makeup. When compared
with album covers tagged as members of the parent genre, hip-hop.
Hip-Hop favors high saturation reds, high contrasts between whites,
grays and blacks, and rarely uses yellows and greens. Chillhop however
is dominated by soft warm colors and medium cool colors. High saturation
colors don't even appear in the Chillhop color plot. The soft colors in
chillhop album covers are often there to give the viewer the sense that
what they're about to listen to will be relaxing and pleasant. This
stands in contrast to the more serious parent genre hip-hop which is
often trying to give the listener the sense that their album is to be
taken seriously, and for rap albums that the artist may be trying to
make a point about something. For example Rap music for social activism
is very popular on bandcamp, but you'd be hard-pressed to find any of
these artists who would self-identify as chillhop artists.

The brightness plots show us more interesting findings. For one, the
luminescence tends to be lower for hip-hop than chillhop. This aligns
with the cultural feeling that chillhop is not for serious point making,
or high emotion, it's intended to be light and relaxing.

### Next Steps

Next steps for me would be to look for similar patterns in other genres
and subgenres. For example, we can look at the subgenre 'acoustic
alternative' in contrast with the parent genre 'alternative'. This is a
place where we'd expect to see similar patterns, with greater use of
earth tones in the acoustic albums and more harsh colors in the
alternative albums. Due to the scope of this assignment, I couldn't
really dig into these, nor construct an automated way to compare tags to
one another. This is mainly due to the fact that it's infeasible to load
more than 5 GB of data into my laptop's RAM at a time, but if I
construct metrics for comparing albums to one another (like the dominant
color charts) this limitation can be avoided. I think that constructing
better analysis methods is the best way to examine these patterns. I'd
also like to run the album covers through google-cloud-vision to see if
there are recurring iconography in the genres of interest. All of the
artists that this analysis used were within 5 links of
'chillhop.bandcamp.com' as well, which could be problematic for
comparison purposes. With more time it would be feasible to enter a
couple of starting points and gather a more diverse list of artists.

</div>

</div>

</div>

</div>

</div>
