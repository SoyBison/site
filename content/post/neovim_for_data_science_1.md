---
author: Coen D. Needell
date: 2022-12-23
title: "Neovim for Data Science, Part 1: Scripting"
tags: ["Data Science", "tools", "software for science"]
project: "nvim_data"
---

Vim, "the ubiquitous text editor", has been with us since the 1980s, with new programmers discovering its arcane power every day.
It was originally developed for the Atari ST under the name "Stevie" (ST Editor for VI Enthusiasts), and was later ported to Unix and OS/2 (a precursor to Windows).
Originally, vim was simply an Atari port of `vi`[^1]:, which in turn was the `vi`sual mode for the command line text editor `ex`[^2].
It continued to use the name "Stevie" until 1993, when the name was changed to Vi iMproved (vim for short).
Most of the features we know vim for were added in the late '90s, like a basic scripting language, file browsing, and other useful tools.

Vim has, and has always had, the philosophy that "Vim is not an IDE (integrated development environment)". While the term "IDE" is ill-defined, vim enthusiasts still have strong opinions as to whether some feature violates this philosophy.
The IDE is so ill-defined, in fact, that it's difficult to pin down what an IDE is, how it emerged, and which programs are IDEs and which are not.
To avoid this argument entirely, Neovim was created in 2015 as a fork of vim. This coincides, historically, with a revival of developer interest in text-mode interfaces [^3].

## Neovim

In comparison with vim, Neovim provides a lua-based interface for programming plugins, a first-class api, and the ability to embed itself into gui programs, while still maintaining 100% compatibility with vim scripts. 
It also provides a Language Server Protocol client, which uses Microsoft's open language server standard. 
The standard was created in 2016 to enhance third party plugins for VSCode.
This allows a sufficiently motivated user to implement a custom IDE using Neovim as a framework.
Today I'll be sharing tips and tricks I've learned from setting up and using Neovim for social scientific research over the past year or so, as well as configurations I'm developing with [Miguel Rivera-Lanas](https://www.rivera-lanasm.com).
In our lab, Miguel and I found that researchers could use a text-mode IDE when connecting to our High Performance Computing Cluster to quickly make code changes, without having to rely on git to develop and transfer code. 
Using Neovim, scripts can be developed directly over `ssh`, saving researchers time and mental bandwidth.
I also use Neovim for local development, mainly because I find the scripting language much more ergonomic than VSCode's Task system.
Since vim exposes a shell, it's much easier to write custom run configurations than in VSCode[^4].

In my experience, data scientists tend to work in two modes, a scripting mode, and an interactive mode. 
In the scripting mode, we write tools and large pipelines for standardized data processing, often writing long Python scripts, or small tools written in lower level languages.
In the interactive mode, we explore data in a more free-form way, using tools like RStudio and Jupyter Notebooks.
Computational social scientists and some data scientists need to consider a writing mode, for producing academic papers in LaTeX and smaller pieces in Markdown.
Some computational social scientists (including myself) also need to consider the web development mode, for creating surveys and web experiments, as well as for compiling and sharing our findings with the public.
The scripting mode consumes most of our time, and is the simplest and closest to Neovim's default use-case, so this first entry will focus on that mode, and we will return to the other modes in later entries.
This series will assume that the reader has used vim before, and is somewhat comfortable with its quirks, but has not tried to configure it before, and may not understand how vim works under the hood. 
In other words, I will explain in depth much of the code I'm writing, but I won't explain how to actually write in vim. 
There is no shortage of guides on how to use base vim, nor cheatsheets for vim commands, so it's a bit of a waste to reproduce them here.

Since we are starting from scratch in 2022, we will focus on Neovim's lua configuration system, although each of the off-the-shelf parts we use can be configured via vim script as well.
First, a little preview of our final product in action:

![A simple Python script experience.](/media/nvim/demo.gif "A short visual demo depicting a little bit of python programming to get your beak wet.")

## Vim Basics

Because of Vim's strange lineage, its controls may feel alien to new users. 
Trust me when I say you get your sea legs very quickly. Humans are remarkably good at learning how to interface with machines.
You likely don't remember when you learned to touch-type, nor when you learned to read. 
You may remember learning to drive a car or ride a bike, but you don't need to explicitly refer to your training to do these things now.

Recall that vim emerged from a time before we had optical mice, and the keyboard reigned supreme.
Consider the robustness for control that comes from the video game gamepad, whose traditional design has 12 buttons and 6 analog axes.
The average qwerty keyboard has over 100 keys, and was designed as an interface for something so fundamental to being human that we often don't even think about the complexity underneath.
When I type a word, in my mind I am not entering an arcane sequence of keypresses, I am simply entering a word.
This cuts through the technical complexity, and the interface becomes simple again.
The computer only perceives keypresses, it is up to the human to translate these into meaning.

{{< figure src="/media/nvim/8bitdo.jpg" caption="This one has a lot more than 12 buttons and 6 axes, but it is the gamepad I use. It's the 8bitdo ultimate controller. The traditional buttons are four face buttons (ABXY or ◯✖▲◼), the left and right buttons (or bumpers), the start and back buttons (here they're plus and minus, these tend to be the least codified as Sony and Microsoft keep changing them to chase trends), the Directional Pad (sometimes they're implemented as an axis that just maxes out when you press the button). The analog sticks have two axes each, up/down and left/right, and all modern game systems but the Nintendo Switch have an axis for each trigger, which is useful for driving cars in video games. This one also has a 'guide' button, which spawns a menu, a 'pair' button because it's bluetooth, which doesn't get sent to the computer, two buttons on the back where your middle fingers rest, and a gyroscope which implements 6 more axes, the gyroscope is becoming more and more standard for controllers. All in all it's a pretty complicated interface, but most games only use the traditional 12 buttons and 6 axes, and the Switch only supports four axes." >}}

With that brief philosophical interlude over, we can start talking about this particular keyboard-based interface.
If at any time you would like to know more, or simply want an environment to practice on, vim and neovim are packaged with a tutor program designed to show you the ropes. Simply open neovim and type `:Tutor`.
They also package a documentation browser which can be spawned with `:help {search query}`, this *does* support tab completion, which I find extremely helpful.
Pretty much every concept and technical term I use has an entry in `:help`, I highly suggest looking at `:help` *before* searching Google when possible, as Google has a tendency to return outdated results, systematically ignore the most important word in the query, and will match on irrelevant parts of the page like site maps, headers, and content recommendations.

To describe keypresses and vim commands, we use a special notation.
Text within `<` and `>` like `<esc>` describes a non-alphanumeric keypress.
`<CR>` describes a carriage return (enter key).
Keyboard chords are described with the notation `<X-y>`, where `X` describes the option key, and `y` is the target key.
For example, `<C-h>` is Ctrl+h, and `<C-H>` is Ctrl+Shift+h.
`<leader>` refers to a specific keypress, which is `\` by default, but many vim users set it to Caps Lock or Escape.

I highly suggest running the `:Tutor` before going through the rest of the guide, and editing the configuration in neovim itself. The best way to learn is by doing!

## Lua

First things first, we need to set up the configuration environment. 
Neovim is configured in your `$XDG_CONFIG_HOME/nvim`, generally this is `~/.config/nvim` on Linux and MacOS.
In the interest of brevity, as well as knowing my target audience, I won't be covering how to set up Neovim on Windows.
Neovim has some python features under the hood, to enable them your python environment needs to have the `pynvim` package.
You'll want to install this globally, and the preferred way to do this varies from system to system.

```bash
# MacOS
brew install pynvim
# Arch-y distros
pacman -S python-pynvim
# Generic
pip install pynvim
```

Virtual environments will not automatically inherit `pynvim` in their `site-packages`, but we'll work around that later.

## `init`

Most data scientists are not familiar with Lua, so for everything we talk about here I'll compare it to a python analogue.
Lua packages expect a file named `init.lua` to define what happens when you `require` a package. This is analogous to `__init__.py`'s role in `import`-ing modules.
In lua, we import a module with:

```lua
require('module')
-- runs the module's init.lua
require'module'
-- alternate syntax
local module = require'module'
-- some lua modules return a table (lua's generic data structure, 
-- they fill the same role as dictionaries and lists in python)
-- If a left hand side is included, 
-- require will load the module's table into that variable.
-- Note that local variables are generally declared as such in lua.
```

When you start up `nvim`, it will run `~/.config/nvim/init.lua` in your computer's lua interpreter[^5], and set the module location to `~/.config/nvim/lua/`. The beauty of this system is that you may organize this however you like, but I like to have a `core` directory and a `config` directory under `/lua/` so I can easily turn off some parts of my configuration on the fly.
So, to load my `core` directory modules, where I like to drop general vim options and my plugin manager, we can put in our `./init.lua`:

```lua
-- ./init.lua
require('core.keymaps')
require('core.options')
require('core.plugins')
-- why yes I did intentionally use words of the same length

require('config')
-- This will tell the lua interpreter to run ./lua/config/init.lua

```

To make my life easier, I like to use the [Packer](https://github.com/wbthomason/packer.nvim) package manager.
HPCCs tend not to guarantee things like automatic configuration consistency, and we are distributing this config to researchers, so we want to minimize setup cost as much as possible.
Packer's documentation provides a bootstrapping script:

```lua
-- ./lua/core/plugins.lua
local ensure_packer = function()
  local fn = vim.fn
  local install_path = fn.stdpath('data')..'/site/pack/packer/start/packer.nvim'
  if fn.empty(fn.glob(install_path)) > 0 then
    fn.system({'git', 'clone', '--depth', '1', 'https://github.com/wbthomason/packer.nvim', install_path})
    vim.cmd [[packadd packer.nvim]]
    return true
  end
  return false
end

local packer_bootstrap = ensure_packer()

return require('packer').startup(function(use)
    -- The bootstrap function does install this the first time, but we want 
    -- packer to be able to update itself, so we declare it again here.
    use 'wbthomason/packer.nvim'
    -- Packages we want packer to manage go here

  if packer_bootstrap then
    require('packer').sync()
  end
end)
```

We'll add a couple tools to `./lua/core/keymaps.lua` to start with as well[^6].

```lua
-- ./lua/core/keymaps.lua
-- The syntax for these is mode, input, effect, options. 
-- Options expects a table full of options, 
-- and there's a comprehensive list in :help 
-- map-arguments and :help set_keymap.
vim.keymap.set("n", '<leader>date', ':r ! echo "date: $(date --iso)"<CR>', { noremap = true})
-- We'll add more stuff like this in the writing section, 
-- but I use this to quickly datestamp markdown files.

vim.keymap.set("n", '<leader>h', ':nohlsearch<CR>')
-- This is a shortcut to get rid of the highlights from your last search (/ mode)

vim.keymap.set("n", '<leader>S', ':source $HOME/.config/nvim/lua/core/plugins.lua<CR> | :PackerSync<CR>', { noremap = true})
-- This is a shortcut that will update your plugins
-- without having to reload the program.

vim.api.nvim_set_keymap('n', '<leader>do', '<cmd>lua vim.diagnostic.open_float()<CR>', { noremap = true, silent = true })
vim.api.nvim_set_keymap('n', '<leader>d[', '<cmd>lua vim.diagnostic.goto_prev()<CR>', { noremap = true, silent = true })
vim.api.nvim_set_keymap('n', '<leader>d]', '<cmd>lua vim.diagnostic.goto_next()<CR>', { noremap = true, silent = true })
-- These are a very common set of commands used to control the diagnostic layer. 
-- Without plugins there won't be a diagnostic layer, but since it's used by 
-- a bunch of different plugins I feel it belongs in core.
```

Now I'll set a couple options that I happen to like.
This code contains references to "buffers", this is like the general form of a document in vim. 
Every sub-window and tab in your vim session is a buffer.
This evokes the fact that the document as you see it is not located in your computer's storage, but in the memory.
Any of these options can be used as an input for `:help`. 

Here I use both the `opt` notation and the `o` notation.
In the option api, `opt` can be used to set any option in the program, but `vim.x` can be used to set an option in the namespace `x`.
Vim's simplest options like these first couple are in the `o` namespace.

```lua
-- ./lua/core/options.lua
vim.opt.autoread = true 
-- instructs vim to automatically update the buffer if the target file changes

vim.opt.tabstop = 4 
-- four space width tabs
vim.opt.shiftwidth = 4
-- how many spaces to insert when automatically indenting, 
-- used in code block formatting and the "<<" ">>" normal mode bindings, which shift the selection left and right respectively.
vim.opt.shiftround = true
-- round shifts to the nearest whole number multiple of shiftwidth
vim.opt.expandtab = true 
-- automatically changes tabs to spaces where applicable

vim.o.spell = false -- no spellcheck by default
vim.o.number = true
```

There's a small feature of vim that I find annoying. When you run `:help` it will by default open it in a split buffer.
In other words, a separate window.
Sometimes I just want to browse documentation, so I will open neovim without specifying a target file, and run `:help`.
In this case, I would like neovim to open the documentation in the same buffer, instead of spawning a new one.

This is an example of how powerful the lua configuration really is.
By exposing the api to a mature programming language like lua, it allows the user to define complex behavior easily.
Lua was specifically  designed to be easy to learn assuming that you already know at least one programming language, so you won't find it difficult to pick up[^7].

```lua
-- ./lua/core/options.lua

-- Check to see if you're in a blank buffer, 
-- if you are, then assume you are just browsing manuals.
local set_to_help = function ()
    if string.len(vim.api.nvim_buf_get_name(0)) == 0 then
        vim.bo[0].buftype = "help"
    else
        vim.bo[0].buftype = nil
    end
end

-- Recheck for blank page on write
vim.api.nvim_create_autocmd("BufWritePost", { callback = set_to_help , pattern = "*"})
-- run the function on startup too
set_to_help()
```

The neovim api is extensive and very powerful, I highly suggest experimenting with it and seeing what you can create!
All of the best neovim plugins started as personal configuration behavior!

This is an acceptable, fairly minimal configuration for neovim that allows for easy plugin installation.
You can start writing code right now[^8]! But lets make it a little more advanced first. 
We'll start with the small plugins sand work our way up.

## Little Plugins

For each of these plugins, I like to provide a separate config file in `./lua/config/`, and require it in `./lua/config/init.lua`.

Now we'll run through the package list I use for scripts, libraries, and command line tool development. 
When I'm implementing these things I usually trigger the `<leader>S` command we defined earlier frequently to make sure everything is working.

### Color Scheme

Default terminal colors are ugly, let's change them. I like catppuccin, but you should look around for a personal favorite.
I also have used `gruvbox` and `nord` in the past and found them very pleasing.
This part of the config is very personally dependent, and you will probably want to find a theme that matches the rest of your computer's colors.

```lua
-- all of the use commands go in the packer startup function we defined earlier.
-- The syntax here is a github repo but without the https://www.github.com/ part.
use 'catppuccin/nvim'
```

```lua
-- ./lua/config/catppuccin.lua
vim.o.termguicolors = true 
-- most modern color schemes will require this. 
-- It turns out to be pretty complicated to explain exactly what it does,
-- but basically it tells vim to assume you're using a graphical terminal, 
-- as opposed to the base tty. If you don't know what I'm talking about,
-- then you're running a graphical terminal.
vim.cmd [[ colorscheme catppuccin ]]
-- Activates the color scheme. 
-- [[]] is the lua notation for a multi-line string, 
-- and we can use the same alternate function notation as require'whatever'. 
-- Note that I also do this for use by convention. 
-- Again, I'm using a bunch of different conventions to illustrate lua's 
-- flexibility and user-deference, but generally it makes 
-- code harder to read if you do this.
```

### The Tree, The Tabs, and the Line

The file tree helps us jump around from document to document easily. 
I like `nvim-tree` because it's fairly similar to VSCode's file explorer and has decent built-in git integration.
The line fills a similar role to the status bar in VSCode. 
Tabs are natively supported by neovim, but they're not very featureful, so we'll also install `barbar`.
I generally lump these guys together because they're all simple UI mods.

Here I pass a table to `use` instead of just a string: yet another example of Lua's flexibility.
That table contains another table, named `requires` which stores a list of plugins that packer should consider to be dependencies of the main plugin.
I've included `nvim-web-devicons` to make the tree prettier, but other plugins like lualine also will use devicons, so be aware.

In order for Nvim-Web-Devicons to work, you need to have a font installed that provides the unicode code points that it points to. 
The quick and dirty way to do this is to use a [Nerd Font](https://www.nerdfonts.com/), which is designed to provide a large assortment of icons that can be treated as text by your computer.
These things are good to have around anyway, since they are useful in a lot of contexts.
Once there's a nerd font on your computer, you can also insert them in scripts and programs that you write, generally improving the aesthetic of your working environment.
Install a nerd font the preferred way for your ecosystem, and make sure that your terminal emulator has it set as the main font or fallback font.

```lua
  use { 'nvim-tree/nvim-tree.lua',
  requires = {
      'nvim-tree/nvim-web-devicons',
    }
  }
  use 'nvim-lualine/lualine.nvim'
```

```lua
-- ./lua/config/nvim-tree.lua
vim.g.loaded_netrw = 1
vim.g.loaded_netrwPlugin = 1
-- This tells vim that you're overriding the default file browser, netrw
local keymap = vim.keymap.set
local opts = { noremap = true, silent = true}

require("nvim-tree").setup{
    sort_by = "case_sensitive",
    view = {
        adaptive_size = true,
        mappings = {
            list = {
                { key = "h", action = "dir_up" }, -- this is a suggested binding
            },
        },
    },
    renderer = {
        group_empty = true,
    },
}
require'bufferline'.setup{
    animation = false, -- sorry man, but the animations are ugly. 
    -- It's not your fault, its just that it's a tui, and animations
    -- are really hard to make look good in text mode.
    closable = false, 
    -- gets rid of the clickable x to close a tab (not very vimmy)
    auto_hide = true 
    -- if you only edit one file, tabs should not appear imo
}

vim.keymap.set('n', '<c-n>', ':NvimTreeToggle<CR>')
vim.keymap.set('n', '<c-h>', ':NvimTreeFocus<CR>') 
-- By default the tree is on the left of the screen, 
-- so I think of <C-h> as a sort of "go all the way left" command.

-- Move tab focus right
keymap('n', '<A-h>', '<Cmd>BufferPrevious<CR>', opts)
keymap('n', '<A-l>', '<Cmd>BufferNext<CR>', opts)
-- Re-order to previous/next
keymap('n', '<A-H>', '<Cmd>BufferMovePrevious<CR>', opts)
keymap('n', '<A-L>', '<Cmd>BufferMoveNext<CR>', opts)
-- Goto buffer in position...
keymap('n', '<A-1>', '<Cmd>BufferGoto 1<CR>', opts)
keymap('n', '<A-2>', '<Cmd>BufferGoto 2<CR>', opts)
keymap('n', '<A-3>', '<Cmd>BufferGoto 3<CR>', opts)
keymap('n', '<A-4>', '<Cmd>BufferGoto 4<CR>', opts)
keymap('n', '<A-5>', '<Cmd>BufferGoto 5<CR>', opts)
keymap('n', '<A-6>', '<Cmd>BufferGoto 6<CR>', opts)
keymap('n', '<A-7>', '<Cmd>BufferGoto 7<CR>', opts)
keymap('n', '<A-8>', '<Cmd>BufferGoto 8<CR>', opts)
keymap('n', '<A-9>', '<Cmd>BufferGoto 9<CR>', opts)
keymap('n', '<A-0>', '<Cmd>BufferLast<CR>', opts)
-- Pin/unpin buffer
keymap('n', '<A-p>', '<Cmd>BufferPin<CR>', opts)
-- Close buffer
keymap('n', '<A-c>', '<Cmd>BufferClose<CR>', opts)
-- These are some very basic movement commands, 
-- Feel free to change their mappings, 
-- I just happen to like using alt to move tabs, 
-- it mimics the behavior of my web browser 
-- (but vim flavored with the h/l movement keys).
```

Check out the default keymaps for the tree in `:help nvim-tree-mappings`. 
Most of them are pretty intuitive, but there are a lot more than you'd expect.

Some favorites:

| keystroke     | effect                                                    |
| ------------- | -------                                                   |
| o, <CR>       | open                                                      |
| \<C-v>         | open in a new vertically split window                     |
| \<C-x>         | open in a new horizontally split window                   |
| \<C-t>         | open in a new tab                                         |
| <, >          | jump to previous, next sibling directory                  |
| r             | rename                                                    |
| d             | remove                                                    |
| a             | create a new file or directory (trailing / for directory) |

For lualine:

```lua
--- ./lua/config/lualine.lua
require('lualine').setup{
    options = {
        icons_enabled = true, -- requires nvim-web-devicons
        theme = 'catppuccin', -- Set to your colorscheme of choice
    },
    sections = {
        lualine_a = {
            {
                'filename',
                path = 1
            }
        }
    }
}
```

Let's see these guys in action:

![Oh my god it actually has UI now](/media/nvim/tree.gif "Trees and Lines")

### Commenting

I like to use nerd commenter to deal with comments.
It provides a whole commenting system, which I suggest looking into.
For the most part though, I find myself using it's `NERDCommenterToggle` command, which is roughly "comment out the selected line".

```lua
use 'preservim/nerdcommenter'
```

```lua
-- ./lua/config/nerdcommenter.lua

local keymap = vim.keymap.set
-- yet another alternate notation for keymapping

keymap("n", "<leader>c`", "<plug>NERDCommenterAltDelims", {silent = false})
-- Alternate delims depend on the language, 
-- but generally it means inline comments or block comments.
keymap({"n", "v"}, "<leader>c ", "<plug>NERDCommenterToggle", {silent = true})
-- Here we're telling keymap to trigger the command in both Normal and 
-- Visual Selection mode by supplying a table of strings instead of just a string.
```

### Treesitter

Treesitter is a new feature that's semi-built into neovim. 
Treesitter itself is a tool that can generate language parsers.
Treesitter (theoretically) is generic enough to parse any language, fast enough to run on every keystroke, C-Native so it can be embedded anywhere, and won't act weird if you mess up the syntax.
Neovim integration for treesitter is ostensibly still experimental, but it works pretty well on python and lua, and the kind of [bug reports](https://github.com/nvim-treesitter/nvim-treesitter/issues?q=is%3Aopen+is%3Aissue+label%3Abug) they get seem pretty minor to me.

```lua
use 'nvim-treesitter/nvim-treesitter'
use 'p00f/nvim-ts-rainbow' -- if you like rainbow brackets like I do
```

```lua
-- ./lua/config/treesitter.lua

require("nvim-treesitter.configs").setup{
    ensure_installed = {"python", "bash", "yaml", "lua", "json"}, 
    -- you can pretty much throw the kitchen sink in here. 
    -- But you can also limit it if you're on a dsl connection 
    -- and don't want to download a bunch of compiled binaries.
    highlight = {
        enable = true,
        additional_vim_regex_highlighting = false,
    },
    -- this part is only for if you installed nvim-ts-rainbow
    rainbow = {
        enable = true,
        extended_mode = true, -- adds rainbows for stuff like html tags
        max_file_lines = 2500 
        -- you can set this if you ever load big jsons into nvim 
        -- and just don't want to deal with it
        -- I've never written such a big code file before, 
        -- but I've had colleagues send me big monolithic files before, 
        -- otherwise I'd set this to something lower.
    }
}
```

## The LSP

The next couple sections will cover plugins that have to do with the Language Server Protocol (LSP).
This is, in my opinion, the number one reason to use neovim over vim.
There are plugins for vim that do similar things, like `coc`, but the Language Server system is much lighter, more robust, more extensible, and (at least for me) easier to configure.

The Language Server Protocol was created in 2016 by Microsoft's Open Source division to make it easier for developers to implement support for their language in VSCode.
Neovim provides a client for this protocol.
Compared to older linting schemes like those used by JetBrains and Eclipse, the LSP allows a user to set up and run exactly what services they want, and configure them in a central location.
In addition, each language server runs as a separate process on your computer, so if you modify a server's behavior, that modification will propagate to any text editors that use the server.

We are going to use a couple helper tools for managing our servers. 
There's `mason`, which acts as a package manager for lsp servers, and we'll use neovim's own `nvim-lspconfig`, which provides sane defaults and a simple config interface for many servers[^9].
The LSP itself provides things like error detection, code-wise navigation, and code actions (if the server supports it, many don't right now, but will in the future).

In order to make installation easy, we'll also employ a manager for our servers called `mason.nvim`.
We'll also use a plugin called LSPSaga which improves the visual experience of using the LSP.
To handle code completions we'll use `nvim-cmp` (and a number of associated plugins).
And finally we'll use `ultisnips` to provide "code snippets": the little bits of boilerplate code that your IDE can insert for you.
Here is all the setup to put in `./lua/core/plugins.lua`.

```lua
  use {'williamboman/mason.nvim',
       'williamboman/mason-lspconfig.nvim',
       'neovim/nvim-lspconfig'
  }
  use 'glepnir/lspsaga.nvim'

  use {'hrsh7th/nvim-cmp',
  requires = {
    'hrsh7th/cmp-nvim-lsp',
    'hrsh7th/cmp-buffer',
    'hrsh7th/cmp-path',
    'hrsh7th/cmp-cmdline',
    'hrsh7th/cmp-emoji', -- 😄
    }
  }

  use {'SirVer/ultisnips',
    requires = {
        'quangnguyen30192/cmp-nvim-ultisnips',
        'honza/vim-snippets'
    }
  }

    -- Telescope provides a new window type that these plugins tend to prefer,
    -- and other useful tools like a file finder and a generic thing browser
    -- it's not strictly required, because they'll fall back to the vim 
    -- floating window type but it's nice to have
  use {'nvim-telescope/telescope.nvim',
    tag = '0.1.0',
    requires = {
        {'nvim-lua/plenary.nvim'},
        {'BurntSushi/ripgrep'},
        },
  }
```

To set up nvim-cmp:

```lua
-- ./lua/config/nvim-cmp.lua

local cmp = require 'cmp'

cmp.setup {
    snippet = {
        expand = function(args)
            vim.fn["UltiSnips#Anon"](args.body)
        end
    },
    window = {
        -- completion = cmp.config.window.bordered(),
        -- documentation = cmp.config.window.bordered()
    },
    mapping = cmp.mapping.preset.insert({
        ['<C-b>'] = cmp.mapping.scroll_docs( -4),
        ['<C-f>'] = cmp.mapping.scroll_docs(4),
        ['<C-Space>'] = cmp.mapping.complete(),
        ['<C-e>'] = cmp.mapping.abort(),
        ['<CR>'] = cmp.mapping.confirm({ select = false }), -- Accept currently selected item. Set `select` to `false` to only confirm explicitly selected items.})
        ['<Tab>'] = cmp.mapping(function(fallback)
            if cmp.visible() then
                cmp.select_next_item()
            else
                fallback()
            end
        end, { 'i', 's' }),
        ['<S-Tab>'] = cmp.mapping(function(fallback)
            if cmp.visible() then
                cmp.select_prev_item()
            else
                fallback()
            end
        end, { 'i', 's' })
    }),
    sources = cmp.config.sources({
        { name = 'nvim_lsp' },
        { name = 'ultisnips' },
        { name = 'emoji' },
        { name = 'cmdline' },
        { name = 'path' },
    }, {
        { name = 'buffer' },
    })
}

```

To configure the LSP I usually just dump all of my language server setups in one config file.
Feel free to do whatever makes sense to you.

```lua
-- ./lua/config/lsp-config.lua

-- This first section is boilerplate to handle some weirdness with how lua works.
-- It's not strictly necessary unless you intend to hack on 
-- your configuration a lot, or you have something else
-- that is configured with lua. 
-- It will automatically handle global package issues for you.
local runtime_path = vim.split(package.path, ";")
table.insert(runtime_path, "lua/?.lua")
table.insert(runtime_path, "lua/?/init.lua")

local library = {}


local function add(lib)
  for _, p in pairs(vim.fn.expand(lib, false, true)) do
    p = vim.loop.fs_realpath(p)
    library[p] = true
  end
end

-- add runtime
add("$VIMRUNTIME")

-- add your config
add("~/.config/nvim")

-- add plugins
add("~/.local/share/nvim/site/pack/packer/start/*")

-- Start up Mason.nvim
require("mason").setup()
require("mason-lspconfig").setup{
    ensure_installed = {"sumneko_lua",
                        "pyright",
                        "marksman",
                        "bashls"}
} -- We're asking mason to manage four languages for us:
-- lua (sumneko's is basically the only language server)
-- python (you can use pylsp instead of pyright, it implements 
-- the older python linting stack, lets you mix and match
-- the old-fashioned command line linters, and allows you to
-- use jedi and rope for more advanced features.)
-- I like pyright because it's more monolithic and 
-- generally quicker than that stack.
-- Markdown (for writing this blog post!)
-- bash


-- here we're defining a generic function that'll 
-- run whenever a language server starts.
-- This is a good place to put keymaps and commands that 
-- you want to use for all languages, but not for plain text.
local on_attach = function(_, _)
    vim.keymap.set('n', '<leader>rn', vim.lsp.buf.rename, {}) 
    -- a simple refactoring system
    vim.keymap.set('n', 'gd', vim.lsp.buf.definition, {}) 
    -- Jumps to the definition of the thing under your cursor

    vim.keymap.set('n', 'gi', vim.lsp.buf.implementation, {})
    -- Not implemented by all servers, but by enough to justify it going here
    vim.keymap.set('n', 'gr', require('telescope.builtin').lsp_references, {})
    -- in telescope, gives you a menu of every place 
    -- you've used the symbol under the cursor
end
```

Each language server has it's own setup system, but `nvim-lspconfig` implements a `.setup` method that allows us to just pass it a table with server options. 
The [repository](https://github.com/neovim/nvim-lspconfig) for `nvim-lspconfig` provides a decent starting point for each server, but for more advanced features you may need to refer to the VSCode documentation for that server and translate it to Lua tables.

First, `sumneko_lua`.
```lua
-- ./lua/config/lsp-config.lua
require'lspconfig'.sumneko_lua.setup({
    on_attach = on_attach,
    on_new_config = function(config, root)
        local libs = vim.tbl_deep_extend("force", {}, library)
        libs[root] = nil
        config.settings.Lua.workspace.library = libs
        return config
    end,
    settings = {

        Lua = {
        runtime = {
            version = "LuaJIT",
            -- Setup your lua path
            path = runtime_path,
        },
        completion = { callSnippet = "Both" },
        workspace = {
            -- Make the server aware of Neovim runtime files
            library = library,
            checkThirdParty = false,
            maxPreload = 2000,
            preloadFileSize = 50000
        },
        -- Do not send telemetry data containing a 
        -- randomized but unique identifier
        telemetry = {
            enable = false,
        },
        },
    },
})
```

For python, I'm going to add a bit of logic that will automatically load pynvim and pyright into the virtual environment, if you're in a new one.
This will prevent a number of annoying runtime errors, and generally makes the experience of working in a virtual environment better.
We can have it inherit from the generic `on_attach` function we wrote earlier.

```lua
-- ./lua/config/lsp-config.lua
local py_on_attach = function (x, y)
    -- I forget what these params do but they need to be passed to the child function
    on_attach(x, y)
    if vim.fn.exists("$VIRTUAL_ENV") == 1 then
        vim.g.python3_host_prog = vim.fn.substitute(vim.fn.system("which -a python3 | head -n2 | tail -n1"), "\n", "", "g")
        -- check for pynvim
        local is_pynvim_installed = string.len(vim.fn.system("pip freeze | grep pynvim")) ~= 0
        local is_pyright_installed = string.len(vim.fn.system("pip freeze | grep pyright")) ~= 0
        if not is_pynvim_installed and not is_pyright_installed then
            print("pyright and/or pynvim not detected. Installing...")
            vim.api.nvim_exec("!pip install pynvim pyright", false)
        end
    else
        vim.g.python3_host_prog = vim.fn.substitute(vim.fn.system("which python3"), "\n", "", "g")
    end
end
```

Now we can set up pyright.

```lua
-- ./lua/config/lsp-config.lua
require'lspconfig'.pyright.setup{
    on_attach = py_on_attach,
    python = {
        typeCheckingMode = 'off'
    }
}
-- Uwaa so much easier than sumneko! 🎵

```

And finally bashls (if you have shellcheck installed, it will act like shellcheck as well).

```lua
-- ./lua/config/lsp-config.lua
require'lspconfig'.bashls.setup{
    on_attach = on_attach
}
```

### LSPSaga

LSPSaga is a package that improves neovim's interface to the LSP.
In the config file for LSPSaga we'll overwrite some of the base commands we defined in lsp-config, thus it's important to make sure that `./lua/config/lspsaga.lua` is `require`d *after* `./lua/config/lsp-config.lua`.
I chose to do this so that in the event lspsaga doesn't work in some context, we can simply unload the plugin and remove the require statement from `./lua/config/init.lua`.
We're also going to provide a few extra hotkeys for managing different levels of diagnostics, and provide hotkeys for new LSPSaga features.

```lua
-- ./lua/config/lspsaga.lua
local keymap = vim.keymap.set
local saga = require('lspsaga')

saga.init_lsp_saga() -- saga likes to handle the setup method itself.

keymap("n", "gh", "<cmd>Lspsaga lsp_finder<CR>", {silent = true})
keymap({"n","v"}, "<leader>ca", "<cmd>Lspsaga code_action<CR>", { silent = true })
keymap("n", "gr", "<cmd>Lspsaga rename<CR>", { silent = true })
keymap("n", "gp", "<cmd>Lspsaga peek_definition<CR>", { silent = true })
keymap("n", "<leader>cd", "<cmd>Lspsaga show_line_diagnostics<CR>", { silent = true })
keymap("n", "<leader>cd", "<cmd>Lspsaga show_cursor_diagnostics<CR>", { silent = true })

-- This is jump to the nearest diagnostic
-- You can use <C-o> to go back.
keymap("n", "[e", "<cmd>Lspsaga diagnostic_jump_prev<CR>", { silent = true })
keymap("n", "]e", "<cmd>Lspsaga diagnostic_jump_next<CR>", { silent = true })

-- Same as above but only to errors
keymap("n", "[E", function()
  require("lspsaga.diagnostic").goto_prev({ severity = vim.diagnostic.severity.ERROR })
end, { silent = true })
keymap("n", "]E", function()
  require("lspsaga.diagnostic").goto_next({ severity = vim.diagnostic.severity.ERROR })
end, { silent = true })

-- Show documentation for the symbol under your cursor
keymap("n", "K", "<cmd>Lspsaga hover_doc<CR>", { silent = true })

-- Opens a floating terminal
keymap("n", "<A-d>", "<cmd>Lspsaga open_floaterm<CR>", { silent = true })
-- if you want to pass some cli command into a terminal you can do it like this:
-- open lazygit in lspsaga float terminal
keymap("n", "<A-d>", "<cmd>Lspsaga open_floaterm lazygit<CR>", { silent = true })
-- close floaterm
keymap("t", "<A-d>", [[<C-\><C-n><cmd>Lspsaga close_floaterm<CR>]], { silent = true })
```

You may find it helpful to implement commands like the `floaterm lazygit` pattern for specific languages.
For example, if you use rust at all, you might want to have a hotkey, just for rust, that that triggers `cargo run` in the floaterm.
You can accomplish this with an autocommand that runs on the `FileType` event and provides a "dry run" action.

```lua
-- ./lua/config/lspsaga.lua
local ft_runner = function (args)
    if vim.bo[args.buf].filetype == 'rust' then
        keymap("n", "<C-A-n>", "<cmd>Lspsaga open_floaterm cargo run<CR>") 
        -- obviously replace with your preferred stack 
    end -- you can add some elifs here or make it a switch case, whatever you want to do!
end
vim.api.nvim_create_autocmd("FileType", {
    pattern = { "*" },
    callback = ft_options
})
```

You can use patterns like this to establish test-run operations for whatever language you work in, whatever workflow you prefer, whatever systems you use, the sky is the limit.
These are the benefits we get from lua-based configs, freedom, style, and ease.

### Telescope

Telescope supplies us with a couple things, a fuzzy finder, a cool interface, and an extremely deep and powerful api to play with.
The default setup is good enough for our uses right now, but we will revisit it later.
Personally I don't find myself using the search functions enough to justify binding a hotkey.
I'll trigger the command manually like `:Telescope live_grep` if I need to look for something specific in the project folder.
That being said, I do want to be able to get a rundown of all the diagnostics quickly, not for my code, but for colleagues' code.

```lua
-- ./lua/config/telescope.lua
vim.api.nvim_set_keymap('n', '<leader>dd', '<cmd>Telescope diagnostics<CR>', { noremap = true, silent = true})
```

## ToggleTerm

Sometimes when we're building data-driven programs, it can be helpful to have an interactive environment to test snippets in.
Neovim has a built-in terminal emulator, but it can be a little unwieldy.
It would be nice to mimic VSCode's behavior in this area.

```lua
-- ./lua/core/plugins.lua
use 'akinsho/toggleterm.nvim'
```

By default, toggle term has some behaviors that feel a little weird to me.

```lua
-- ./lua/config/toggleterm.lua
require('toggleterm').setup{} -- the default options are fine
local keymap = vim.keymap.set

keymap('t', '<esc>', [[<C-\><C-n>]])
keymap('t', '<C-w><C-h>', [[<cmd>wincmd h<CR>]])
keymap('t', '<C-w><C-j>', [[<cmd>wincmd j<CR>]])
keymap('t', '<C-w><C-k>', [[<cmd>wincmd k<CR>]])
keymap('t', '<C-w><C-l>', [[<cmd>wincmd l<CR>]])

keymap({'n'}, '<C-`>', [[<cmd>ToggleTerm<CR>]])
keymap({'t'}, '<C-`>', [[<C-d>]])
```

Now it'll behave more like a normal window, is bound to the same chord as in VSCode, and will quit when closed instead of sitting in the background causing bugs.


## Conclusion

This seems daunting, I know!
It took me about a week to figure all this stuff out and get it to a place where I like it, and I don't employ any of the zillions of advanced features each of these plugins enable.
On top of that, while writing this guide I changed the config multiple times, adding new features and playing around with existing ones.
If you take anything away from this guide, it should be that neovim is *malleable*, even more so than vim, and certainly more so than any purely graphical text editor on the market.
The features that I've found the most useful in this config are those that I wrote myself in a couple lines of lua in a moment of frustration.
Tools are an extension of the body, and an IDE is no different, it's an extension of your brain.
Everyone's brain works differently, and neovim enables the programmer to build an IDE that works for their brain, as opposed to having to change their brain to interface with the IDE.

Next time we'll dive into image rendering (O' what an adventure) and setting up neovim for exploratory data analysis.
Until then, happy hacking!

## Appendices

### Config Load Order

Neovim will load your config modules in the order you specify in `./lua/config/init.lua`, so you need to make sure that any modules with intentional overrides are in the right order.
Here's the order I'm using.

```lua
require('config.catppuccin')
require('config.lspsaga')
require('config.nerdcommenter')
require('config.lualine')
require('config.nvim-tree')
require('config.lsp-config')
require('config.telescope')
require('config.nvim-cmp')
require('config.treesitter')
require('config.toggleterm')
require('config.markdown')
```

### Simple Markdown Tricks

I didn't go into markdown setup here, because I'm leaving it for part 3: writing papers.
That being said, I did write a little bit of code to help with writing this blog post.

```lua
-- ./lua/config/markdown.lua
vim.g.vim_markdown_conceal = 0
vim.g.tex_conceal = ""
vim.g.vim_markdown_frontmatter = 1
vim.g.markdown_fenced_languages = {'python', 'bash', 'lua'}
vim.g.vim_markdown_folding_disabled = 1

local ft_options = function (args)
    if vim.bo[args.buf].filetype == 'markdown' then
        vim.o.spell = true
    end
end -- I intend to move this to ./lua/core/options.lua later, 
-- when I find other uses for the pattern

vim.api.nvim_create_autocmd("FileType", {
    pattern = { "*" },
    callback = ft_options
})
```


[^1]: Generally, we pronounce the 3-letter codes as a word: "vim" or "sed" or "awk". The two letter codes tend to get pronounced as single letters, `vi` is pronounced "vee eye" and `ed` is pronounced "eee dee". `nvim` is pronounced "enn-vim" but the pattern gets muddier as the commands get longer. I've never met anyone who knows about `ex` in-person, but I suspect it was pronounced "eee ecks". 
[^2]: `ex` is short for `ex`tended, which in turn was an extension to the Bell Labs original `ed` (`ed`itor). `ed` was written for the PDP-7 which didn't have a screen. `ex` was designed to be `ed` but with textual feedback for computers with video terminals (the PDP-7 communicated via teletype, so feedback was a luxury that Ken Thompson could ill afford). 
[^3]: The savvy reader will notice a slight gap in this timeline. In the late '90s we see the beginning of the GUI's dominance, and interest in text-mode interfaces waned for a while. This is slowly reversing as more and more young developers fall in love with the Unix shell. For a discussion of how to use the Unix shell for data science, I suggest Jaroen Janssen's [_Data Science at the Command Line_](https://datascienceatthecommandline.com/2e/) which can be read for free online. I don't agree with everything he says, for example he uncritically distributes a couple data tools (most of them are his own creations) that are not really worth the hassle in my opinion.
[^4]: I'll cover this more in the forthcoming "writing" post, but just to include a favorite of mine: `:autocmd BufWritePost *.md !pandoc % -o %:r.pdf` will automatically render your markdown in the background whenever you save the file. If you have the output pdf opened in a reader that supports it (most do), it will update in that window as well. A LaTeX analogue would be: `:autocmd BufWritePost *.tex !pdflatex %; biber %:r; pdflatex %` (or whatever your favored LaTeX pipeline is). `%` in the autocommand will be replaced with the filename, and :r tells it to drop the file extension.
[^5]: Generally the interpreter will be the very fast LuaJIT, but for some systems it'll be the slower base lua interpreter. You can see which one you're running with `nvim --version`.
[^6]: You'll notice I'm using the vim and neovim apis interchangeably. This is to illustrate that there's more than one way to do everything in this environment. The lineage of neovim is long and convoluted, and to maintain backwards compatibility, each addition supports the previous framework. Neovim's lua configs can access the `vim` level, the `vi` level, and can even execute `ex` and `ed` scripts.
[^7]: I write my lua code in a very python-y way, since I have the most formal training with the python interpreter. Lua also supports functional modes, procedural modes and full object oriented modes of coding, and they can be mixed on the fly. This is why lua is so dominant as a configuration language, and is also deployed for video game modding, high level game development, ui design, and many more contexts. I also am a user of [awesomewm](https://awesomewm.org/) which is configured in lua. The UI for World of Warcraft famously provides a lua interface for modding, and Paradox Interactive uses a lua-like language for AI, UI, and other high level behaviors in their grand strategy games, just to name a few examples. You probably already use a program that supports lua modding without even knowing it.
[^8]: You could've earlier too, but you also can now.
[^9]: You might ask: "why do we need to install a plugin for this? Why isn't it packaged with neovim?" While neovim has freed itself from the "vim is not an ide" rhetoric, it still doesn't want to force users to make it an ide. `nvim-lspconfig` is *relatively* and this is how nvim's developers have chosen to make it an optional feature.
