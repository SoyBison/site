---
author: Coen D. Needell
date: 2023-02-26
title: "Neovim for Data Science, Part 2: Interactive Mode"
tags: ["Data Science", "tools", "software for science"]
draft: true
project: "nvim_data"
---

In the [first]({{< ref "neovim_for_data_science_1.md" >}}) part of this series we looked at how to make neovim a comfortable place to write data science scripts.
Well, writing scripts is important, but it's also the most "vanilla programming" part of data science.
Scripting is but one facet of the job, and it's not unique to data scientists.

Most of the data scientist's time is spent in an interactive environment.
Compared to scripting, the interactive environment allows us to interact with data in a more exploratory way.
Every time you want to make a minor change to a script, it's likely you'll have to rerun all of your pre-processing code.
For some projects this can be prohibitively expensive!

Generally, the interactive environment is where proprietary solutions like SPSS, STATA, and MATLAB excel.
For those who engage in the R vs Python debate, the RStudio interactive environment is a major point in R's favor.
Perhaps we can extend the best behaviors from RStudio to Neovim, giving us the ability to explore data with a smooth experience, even integrating it with our scripting environment.

Unlike in the scripting section where we were chasing VSCode-like interfaces, I think for an interactive environment we should take our cues from RStudio.
For me the most desired features are built around integrating other windows with the REPL.

The features I would say are essential for success are:

1. The REPL
2. A static window that holds the most recently rendered figure (ideally with a navigable history).
3. A way to easily move selections from a script to the REPL
4. An easy method to prototype blocks of code, and save them to a script
5. A way to define "blocks" of code for easy navigation and selection.

{{< response >}}
Why don't you just use Jupyter? Or RStudio? There are ways to use them multilingually.
{{< /response >}}

Yes but they have their faults, I've found myself abandoning most of these for a script-focused workflow lately, but it does make exploratory work much harder.
There isn't really a "light" option for interactive environments, so the existing options all irk that part of my brain.
Jupyter makes it extremely easy for (especially students) to write code that doesn't run.
Since there's no separation between the script, the environment, or the plots, I find it easy for my blocks to get out of order, or to otherwise run into problems.
RStudio is great, but it's starting to age and collect pointless features. 
It's also fairly heavy, and managing plugins is awkward.
It's very R-focused, and support for other languages exists but isn't well developed.
We will definitely want to write notebooks in Python, sometimes we may prefer Bash, in certain times we might want to explore our data with Haskell, Julia, or Rust (okay probably not Rust).

Either way, it's foregone goal of mine to use Neovim for as much of my data science stack as possible, so a generic data science environment will be essential.

First, the core of the interactive programming mode, the REPL.

## REPL

We'll use Iron.nvim as our REPL manager.
Iron actually implements a good portion of the "essentials" out of the box.
The negative is that it's meant to be used mostly as a remote control.
The REPL can be focused and interacted with actively, but generally data is supposed to go from the script to the REPL.
In many ways this is a good thing, it forces us to save the weird rabbit holes we go down.
On the other hand it increases the cost of free-form exploration, so we will need to do some work on top of Iron.
But out of the box Iron fills requirements 1 and 3, which is pretty nice.
Here's the Iron setup. I'll be putting everything for today's prototype in `.config/nvim/lua/config/interactive.lua` and adding `require'config.interactive'` to my `lua/config/init.lua`.


```lua
-- lua/config/interactive.lua

local iron = require"iron.core"

iron.setup {
    config = {
        scratch_repl = true,
        repl_definition =  {
            python = {
                command = {"ipython", "--no-autoindent"} -- The flag is required, otherwise ipython will automatically mess with data it gets sent.
                },
            sh = {
                command = {"fish"}
            },
        },
        repl_open_cmd = require'iron.view'.right(.382, {
            number = false
        })
    },
    keymaps = {
        -- I'm not totally sold on space as the leader for these, but it makes it feel like they're 
        -- mode-driven commands to me. In other words, I *feel* like leader should be used for global paradigm 
        -- commands, and space and other leaders can be used, like here, for specific paradigm commands

        -- I'm also not implementing everything Iron allows for.
        visual_send = "<space>sc",
        send_file = "<space>sf", -- for some reason gives me a bunch of blanks
        send_line = "<space>sl",
        cr = "<space>s<cr>",
        interrupt = "<space>s<space>",
        exit = "<space>sq",
        clear = "<space>cl",
    },
    highlight = {
        italic = true
    },
    ignore_blank_lines = true,
}

vim.keymap.set('n', '<leader>rs', '<cmd>IronRepl<cr>')
vim.keymap.set('n', '<leader>rr', '<cmd>IronRestart<cr>')
vim.keymap.set('n', '<leader>rf', '<cmd>IronFocus<cr>a') -- the "a" at the end tells it to go into term mode
vim.keymap.set('n', '<leader>rh', '<cmd>IronHide<cr>')


-- These are all window selection hotkeys that feel more natural to me.
-- The first one is how you leave terminal mode, by default its <C-\><C-n>
vim.keymap.set('t', '<esc>', [[<C-\><C-n>]])
vim.keymap.set('t', '<C-w>h', [[<cmd>wincmd h<CR>]])
vim.keymap.set('t', '<C-w>j', [[<cmd>wincmd j<CR>]])
vim.keymap.set('t', '<C-w>k', [[<cmd>wincmd k<CR>]])
vim.keymap.set('t', '<C-w>l', [[<cmd>wincmd l<CR>]])
```

{{< figure src="/post/nvds/repl.gif" caption="A video of me testing this on a notebook that loads Shodan Data for a side project">}}

While I'm at it, I'll also set up a language server for R.

```lua
-- lua/config/lsp-config.lua
require 'lspconfig'.r_language_server.setup {}
```

I'll also set an autocommand that removes the line numbers from terminal windows.

```lua
-- lua/core/options.lua
vim.api.nvim_create_autocmd("TermOpen", { callback = function() vim.o.number = false end, pattern = "*" })
```


## REPL Blocks

We want some way to easily define blocks in a script, and easily send a block to the REPL.
This will emulate the block behavior in Jupyter, plus we can tailor the user experience a little.
Vim has a couple concepts that can be used to define a block.
The intuitive choice is the "fold".
This is used in vim to organize long text files, quickly hide function matter, and otherwise clean up the screen.
The fold is usually combined with the concept of "text objects" to quickly create new folds.

{{< figure src="/post/nvds/folding.gif" caption="A quick visual demo using text objects and folds to quickly select and hide a semantic region of code" >}}

The fold is probably going too far for us, but we could certainly make a text object that allows us to quickly select an author-defined block.
I like PyCharm's approach to this, where a block is delimited by `%%` within a comment.
The user defines a new block simply by inserting that comment into the script.
This way, the whole script can be run normally, but we can still control the REPL efficiently.
First, let's write a function that defines the block the cursor is in.

```lua
local find_pattern_in_comment = function(pattern, flags)
    local next_mark = vim.fn.search(pattern, flags, 0, 0, 'nerdcommenter#IsLineCommented(".") == 0')
    if next_mark == 0 then
        if string.match(flags, 'b') then
            return 0
        end
        return vim.fn.line("$")
    end
    return next_mark
end

```

