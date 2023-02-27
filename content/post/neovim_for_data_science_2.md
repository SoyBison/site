---
author: Coen D. Needell
date: 2023-02-26
title: "Neovim for Data Science, Part 2: Interactive Mode"
tags: ["Data Science", "tools", "software for science"]
project: "nvim_data"
---

In the [first]({{< ref "neovim_for_data_science_1.md" >}}) part of this series we looked at how to make neovim a comfortable place to write data science scripts.
Well, writing scripts is important, but it's also the most "vanilla programming" part of data science.
Scripting is but one facet of the job, and it's not very unique to data scientists.

Most of the data scientist's time is spent in an interactive environment.
Compared to scripting, the interactive environment allows us to interact with data in a more exploratory way.
Every time you want to make a minor change to a script, it's likely you'll have to rerun all of your pre-processing code.
For some projects this can be prohibitively expensive!

Generally, the interactive environment is where proprietary solutions like SPSS, STATA, and MATLAB excel.
For those who engage in the R vs Python debate, the RStudio interactive environment is a major point in R's favor.
Perhaps we can extend the best behaviors from RStudio to Neovim, giving us the ability to explore data with a smooth experience, even integrating it with our scripting environment.

Unlike in the scripting section where we were chasing VSCode-like interfaces, I think here we should take our cues from RStudio.
For me the most desired features are built around integrating other windows with the REPL.

The features I would say are essential for success are:

1. The REPL
2. A static window that holds the most recently rendered figure (ideally with a navigable history).
3. A way to easily move selections from a script to the REPL
4. An easy method to prototype blocks of code, and save them to a script
5. A way to define "blocks" of code for easy navigation and selection.

{{< response >}}
Why don't you just use Jupyter? Or RStdio? There are ways to use them multi-lingually.
{{< /response >}}

Yes but they have their faults, I've found myself abandoning most of these for a script-focused workflow lately, but it does make exploratory work much harder.
There isn't really a "light" option for interactive environments, so the existing options all irk that part of my brain.
Jupyter makes it extremely easy for (especially students) to write code that doesn't run.
Since there's no separation between the script, the environment, or the plots, I find it easy for my blocks to get out of order, or to otherwise run into problems.
RStudio is great, but it it's starting to age and collect pointless features. 
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

