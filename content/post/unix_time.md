---
# Documentation: https://wowchemy.com/docs/managing-content/

title: "Adventures in Creating A Visibly Unique Desktop"
subtitle: ""
summary: ""
authors: ["Coen D. Needell"]
tags: []
categories: []
date: 2021-10-29T14:44:14-04:00
lastmod: 2021-10-29T14:44:14-04:00
featured: false
draft: true 
highlight: true

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# Focal points: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight.
image:
  caption: ""
  focal_point: ""
  preview_only: false

# Projects (optional).
#   Associate this post with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects = ["internal-project"]` references `content/project/deep-learning/index.md`.
#   Otherwise, set `projects = []`.
projects: []
---

# Background and Complaining

Over the bulk of the COVID-19 pandemic, I have taken up customizing my Linux setup as a hobby.
I currently own and frequently use three separate computers:
  - A Lenovo T490S, which would be a fantastic laptop, if it weren't for the fact that it is managed by my employer and therefore must run Windows 11.
  - An Asus ROG Zephyrus from c. 2018, a fantastic laptop, period, which runs one of these custom Linux installs and nothing else.
  - A High End desktop, built to do Deep Learning, which runs Linux when I am working but has a minimal Windows installation for games and/or audio production. I play the synthesizer, and I haven't found good software for it that runs on Linux yet.

I'm writing this now on the ASUS Laptop, because I've decided to remake the environment on my desktop from scratch.
First, a visual of what it looked like before.
![The Old Setup](/media/rice/oldrice.png)

The look is inspired by the video game _Hacknet_, which contains a lot of very beautiful psuedo-linux computers.[^1]

![A screenshot from Hacknet](/media/rice/hacknet_screenshot4.png)

In a similar vein, here is a screenshot of me writing this on my laptop.

![A screenshot from my laptop](/media/rice/gruvy.png)

These are fairly standard approaches to a Linux desktop environment these days, and to explain what's going on here we'll need to cover some basics.

## The Distribution

The particular distribution of Linux that one chooses to use is important in this process, but not as important as you might think.
Anything you can do on a distribution of Linux you can do on any other distribution, however, some things are easier, and some are harder on different distributions.
While most Linux users use the default settings for their distribution (or perhaps a purturbation of those settings), a small minority chooses to heavily modify their desktop.
These modifications are collectively called a _rice_.
The most well-known community for _ricing_ the unix desktop is [r/unixporn](https://www.reddit.com/r/unixporn)(Safe For Work).
This is a decent place to go for ideas, but you really have to sift through it to find anything really unique, but it does tell us what is *possible*.

A lot of _ricers_ use [Arch Linux](https://www.archlinux.org), largely because it starts you out with a bare-bones operating system, and allows you to make every choice along the way, and truly make your OS your own. In this discussion I'll be using Arch Linux.

That being said it's an absolute pain in the proverbial ass, and you should only try it if you're willing to waste a day and a half getting a handle on everything. If you're intrigued by this discussion, and want to try ricing, but don't want to spend this much time and effort on everything, try [Manjaro](https://manjaro.org/) or [EndeavourOS](https://endeavouros.com/) or [Garuda](https://garudalinux.org/).
It's just as easy to customize, but it is also fully featured out-of-the-box, and you'll be able to do most of the stuff I do in this discussion verbatim.
If you absolutely fall in love, then try Arch.

All this stuff will work on Debian-based distributions, but you might have to do some manual installation.
Both Manjaro and Arch can easily access the [AUR](https://aur.archlinux.org/), which is in some ways a wretched hive of scum and villainry, but also allows you to easily manage weird packages that may not be approved by your distribution maintainers.

## The Window Manager

First things first, we need a **Window Manager**. This is, predictably, a program that manages your windows.
It chooses where they go, how big they are, and what sort of decoration they have around the edges.
As might be obvious from the above screenshots, I like the decoration to be minimal.
I don't particularly care for the top bars which are standard from MacOS/Windows.
The upper-right controls can be easily handled by keyboard shortcuts, and I love the option to have windows be full-screen, which the top bar generally interferes with.

Generally speaking, there are two kinds of window managers (not entirely true, but for simplicity we'll stick with this ontology). There are "stacking" window managers, which are more MacOS/Windows-like and there are "tiling" window managers, which automatically arrange and resize the windows to fill the whole screen.
I have gotten used to using _i3WM_, which is a fairly minimalistic (though not the most minimal) tiling window manager. It is optimized for text-based interfaces, and then going full-screen for your big gui applications.
There are an assortment of great text-based programs that work amazingly well in the _de facto_ i3 ecosystem. 
  - `polybar`: Creates a fantastic text-based status bar, and is the one I used in those screenshots.
  - `mpd` and `ncmpcpp`: poorly named, but wonderfully feature-ful music management, all from the command line. 
  - `neovim`: What I'm writing this blog post with right now!
  - `ranger`: Great text based file management and browsing.
 
This leads us to our first problem:

<center>
<big>
<b>The world is not made for tiling.</b>
</big>
</center><br>


While most developers these days are good at being _platform agnostic_ they are not _style agnostic_. Which is, in the wide-view, fine, the kind of people who use tiling window managers, generally are comfortable with making their own solutions to these problems.
This was not a big deal for me until the dreaded _drag and drop_ reared its ugly head.
How do you drag and drop files from `ranger`? I can't just drag a music folder from `ranger` into `ncmpcpp`, they run in a terminal emulator.

Well, okay, most things have a workaround, I can click browse on this website to choose something to upload, `mpd` has a sort of music database file that I can add songs to, no big deal. 
Here's what a web-based file browser looks like on my laptop's setup.

![Ugly browser](/media/rice/browse.png)

This opens up a file browser, it inhereits a theme from GTK, which is a unified framework for making guis in the Linux desktop, and the top bar is inhereted from i3. It's ugly.
Okay so then if I want to make something pretty here, I'd have to also make a theme for GTK, and also for QT (a competitor to GTK).
This is mainly whiny, there are good systems for easily making GTK themes these days, and for converting GTK themes to QT themes, so lets just move on to the next problem. Session memory.

Many apps will restore your *session* when you open them. For a handful of these apps, the session includes window position and size.
JetBrains IDE does this, but by the time it loads up, i3 will have taken over and fixed any weirdness.
Firefox however, does this:

![Firefox why](/media/rice/firewhat.png)

So there's a huge deadspace in the window, because firefox sized the content to the old window size, but i3 created a new window with a new window size.

## Random Features

### Screenshots

Getting screenshots to work properly on i3 is outrageously hard. This is a snippet from my i3 configuration, but I'll  break it down for the non-i3 user. Luckily, i3 configs are fairly readable.
```

# Screenshots using xclip and import
bindsym --release Shift+XF86Launch1 exec "import -window root png:- | xclip -selection clipboard -t image/png"
bindsym --release Ctrl+Shift+XF86Launch1 exec "import png:- | xclip -selection clipboard -t image/png"
bindsym --release XF86Launch1 exec i3-input -F 'exec import ~/Pictures/screens/%s' -P 'filename: '
```

`bindsym` just tells i3 to bind a command to a keypress. The `--release` flag means to do the action when the button is released. My laptop doesn't have a PrintScreen key, so I'm using one of ASUS's weird custom keys, which sends X11 the code "XF86Launch1". `exec` tells i3 to run a shell command. `import`
is ImageMagick's screenshot tool. I chose this because it's pretty much standard on linux systems these days. The alternatives would be a program like `gnome-screenshot` (more on that later). Two of the above commands pipe the image to xclip, so I can just Ctrl+V the image wherever I need it, which is good 90% of the time, but is incompatible with, for instance, Thunderbird, so I need to also be able to save it to a real file, that can then be selected in the browser.

## Why Tile?

If these issues bother me so much, why am I using i3 still? Well... I like it. Having a mostly keyboard driven OS is fabulous for my workflow.
Maybe you don't buy into that argument though, which is fine, keyboard shortcuts aren't for everyone.
Why tile then? As fantastic as the Asus ROG Zephyrus is, it has probably the worst mouse pad that has ever moused the pad. It's sequestered into a weird corner, and whenever I use it it absorbs the natural oils from my skin, leaving my fingertips feeling weird. In addition it's inaccurate. So, I use a plug in mouse most of the time, but I can't always plug in a mouse.
Thus, keyboard shortcuts. Once you get used to a mouse-pad free world it's very hard to go back. On the rare occasion I must use the mouse pad I am reminded of how imprecise a tool it really is.

## The future

How do I reconcile these problems? I want a system that is:
  - Beautiful
  - Fully Featured
  - Doesn't result in odd behavior

Fully featured, and behaves normally are not hard. GNOME, KDE, and XFCE are all great solutions to this, and in fact I'd recommend them to any newcomers to the linux world as they'll behave in a familiar way to your MacOS and your Windows.

## Stacking Window Managers

The window managers I just mentioned are really more like ecosystems. A window manager like i3 really just does that. It manages your windows. If I install `plasma`, or `gnome`, my package manager will install a window manager, but also a login manager, a bunch of apps, like file management systems, daemons that monitor my usb ports, daemons that monitor my bluetooth, daemons that manage my displays, apps for managing settings graphically, etc etc etc.

So if I choose one of those window managers, I really have to be ready to buy into their ecosystem.
Also because these are so heavy, it can be A: easy to install the entire `gnome` ecosystem by accident and B: easy to accidentlly install something that can't be easily uninstalled if you later decide you don't like it.

In addition we're going to have to worry about a compositor.

## Composition

This is the real pain. The big, fully featured ecosystems, KDE and GNOME have their own custom compositors. This is the piece that takes your windows and adds some cute effects that make it pretty.
This is where my blurry backgrounds came from, but it also can add animated fades, drop shadows, etc.
The best one that isn't in GNOME or KDE is probably `picom`, but it has screen-tearing issues if you aren't using a tiling window manager and you're using an NVIDIA graphics card.[^2]

## Beauty

It's subjective. But still, there's some stuff that people faun which just isn't very good looking.
I linked to r/unixporn earlier, and there's some good examples on there, but a lot of it can be put into three categories:
  1. Making it look like MacOS
  2. Tiling Window Manager with Nordic Color Theme and slight blur
  3. Making it look like an old OS

There are some really creative posts on there, and I don't want to knock people who are showing off their style. Obviously they enjoyed making their MacOS-like, or samey tiled rice, and that's fine. it does put a damper on going there to get new ideas though.

Well, we could check their top posts of all time, and see what's going on there.
A couple of memes, and really weird challenge posts. Like installing Arch on a Nintendo DS, or a terminal emulator for the smart watch.

There are however, a handful of really creative systems on here though. It seems like the really out there systems use AwesomeWM, which is not easily categorized into the Tiling/Stacking dichotomy, and I have used in the past, or OpenBox, which is a minimal stacking WM, and would require some heavy modding and hacking to get to a fully featured level.

# CREATION

Okay now onto the important parts. First, let's pick a window manager. If we want to make something really weird, then we should choose one where we have a lot of options. This leads me to either OpenBox or AwesomeWM.

This is what the desktop looks like at this stage. I've already installed a music player (`ncmpcpp`), which is shown here running in the tty (text only mode).

![ncmpcpp](/media/rice/tty4.png)

Having a music player, or a youtube video, or tv to watch during the ricing process is absolutely essential. Before even installing a gui, I generally do the following to set up a music player:

```bash
sudo pacman -S mpd mpc ncmpcpp alsa-utils pulseaudio
```
Here `mpd` is a music player daemon, it runs in the background, keeps a database of all your music, and plays music over alsa. `mpc` is a command line interface for `mpd`, and `ncmpcpp` is a text-based client. We can also install an AUR helper, which is a program that extends `pacman` to use unofficial packages as well, and you won't need to go through the whole rigamarole of cloning a git repository, running make package, and then dealing with dependencies. You can even uninstall AUR packages with `pacman`. I use `yay`, instructions for install [here](https://github.com/Jguer/yay).

For ease of use on the command line I also use `zsh` as my default shell, and `oh-my-zsh` as a modification framework.



I've already set up graphics drivers and audio drivers and whatnot, so we won't need to worry about that.

Here are some of the options, based on our previous criteria.
  - KDE/Plasma
    - As previously mentioned, KDE is a fully featured choice, but we will lose some of the efficiency of using a tiling system. It's also less easy to modify than most choices, but it also has a built in composotion pipeline. An option is to replace the window manager within Plasma with i3 or another window manager, but then we lose some of the smoothness.
  - OpenBox
      - OpenBox is an old system, but people have made some really beautiful things with it in the past. One problem is that there are no easy ways to automatically manage windows, but the positive is that it's fairly easy to modify. Except that all the config files are in XML format, so they're not particularly intuitive. On the other hand though, it's easy to connect OpenBox up to any scripting language you want, so we could modify it in python if we wanted.
  - AwesomeWM
      - AwesomeWM is a good compromise choice, it's a window manager that's designed for tiling, but works perfectly well with non-tiled ecosystems. The configs are written in Lua, which makes it fairly easy to modify, but it handles multiple screens in, what I think, is a strange way.
  - QTile
      - I really want to love QTile. For one it's entirely written in Python so it's extremely easy to modify. The negative is that it isn't wholly mature yet. It's fairly new on the scene with the first release in mid-2019, but its hackability has made it a favorite.

To be perfectly honest, the choice beyond this point is arbitrary. After agonizing over this for (christ) like three days, I just ended up rolling a d4. I rolled a 2, and the second in this list is OpenBox.

## The first few minutes

We'll need a display manager to handle booting into the X-Server, logging in, and setting us up. Then we'll need to install OpenBox. Luckily it's on the Arch repository as `openbox`. I'm a huge fan of LightDM as the display manager, so we'll use that, but we need to choose a greeter. We'll use the GTK greeter for now, since we will be able to easily modify that later.

Here are the problems I foresee.
  - OpenBox is very simple, I'm going to have to set up a lot of features myself.
  - While all of these systems aren't particularly beautiful by default, OpenBox is singularly fugly by default.
  - Configs are in XML.

Here are the pros to using OpenBox that I can think of right away:
  - Traditional-ish setup, if someone else tries to use my laptop I don't have to walk them through every single keypress to do basic things.
  - Hella customizable. Because the configs are in XML, you can call pretty much arbitrary commands and scripts from them, including python. If I want to sit down and develop entire plugins for OpenBox, that's my prerogative.
  - Well-developed, it has been a favorite alternate Window Manager for like 20 years, so there's a rich environment of mods tweaks and scripts for us to shameless steal from.

Here is the installation line:

```bash
sudo pacman -S openbox lightdm lightdm-gtk-greeter
# LightDM setup
systemctl enable lightdm

# setup
mkdir -p ~/.config/openbox
cp -a /etc/xdg/openbox/ ~/.config/
```
At this point we also need to ensure we have two terminal emulators installed (just in case one fails.)
I like to use [`kitty`](https://sw.kovidgoyal.net/kitty/) and `xterm`. Kitty has great gpu acceleration features, and XTerm has the benefit of being specified in the default configs for every window manager out there.
And then we'll reboot. Normally you would have to specify the lightdm greeter you installed in the config file `/etc/lightdm/lightdm.conf`, but the gtk based greeter is the default.



## OpenBox

Here's what the current configuration looks like. First you'll notice my terminal has not-very-standard colors.
I transferred my kitty config from the previous setup, which preserved the color scheme, but we'll change it later.
I've also installed `mpv` so that I can rewatch _The Magicians_ for roughly the 70th time while messing with my configs, shown on the right hand side[^3].

![OpenBox with no style](/media/rice/raw_ob.png)

## Style

First, we need to choose a style to tune the rest of our adventure to. It's not particularly creative, but right now I'm leaning toward a sort of mid-century modern vibe. It's good to start with a wallpaper and work our way up, so we'll also install `nitrogen`, as a wallpaper manager.
We're coming up on winter at the time of writing, so let's make something winter-y.

A cursory search got us some interesting things.
The first thing I noticed is that if we want a coherent image across both of the screens, our choices are extremely limited.
Having both screens show the same image could be a little strange if the wallpaper as some object as the focus.

![Cabin in the proverbial woods](/media/rice/single_cabin.png)

Oh well that's pleasant. It's dark, very fitting for winter, but has a shock of warmth to open it up.

![Oh that's less nice in context](/media/rice/double_vision.png)

Hmm, when doubled it's less pleasant. In fact it's a tad weird.
Okay well what if we take something with a less obvious focus, and then just mirror it.

![Some Trees](/media/rice/treelake.jpg)

Pretty, allows us to use greens and blues in addition to blacks and whites. Now let's flop it with imagemagick.

```bash
sudo pacman -S imagemagick
convert -flop treelake.jpg laketree.jpg
```

![seerT emoS](/media/rice/laketree.jpg)

And in context:

![seerT emoSSome Trees](/media/rice/floptree.png)

Okay it's a little obvious near the middle, but that's covered up by the bezel. Let's stick with it.

## Usability

I kinda cheated here. In order to do the last section with nitrogen, I set up some usability tricks in openbox first. This is because I:
  1. Didn't want to spend a bunch of time fiddling with things using the menus and XTerm.
  2. I have an old config for `kitty` that is very easy on my eyes, and the default config for XTerm (which is in the default OpenBox menu) is hideous.
  3. I had to take screenshots.

These things considered, I'd say in most circumstances you'd want to put up your wallpaper first because it really does so much heavy lifting in making the desktop not look like garbage.

### OpenBox Configs

OpenBox configs are, weirdly enough, written in XML format, sorta like HTML but from the 90s. The negative of it, is that prolonged exposure will mess with your brain, but the positive of it is that it's very mature and well defined. In addition, the OpenBox configs have a lot of management tools, so it's easy to define arbitrary commands, including calling outside scripts written in whatever language you want.

We're going to start with the key and mouse binding syntax, which is in the `<keyboard>` and `<mouse>` section of the file `.config/openbox/rc.xml`

### Screenshots

Screenshotting on Linux is a bit of a mess since it has to go through your X-Server. The major ecosystems (KDE, GNOME, XFCE) all have their own systems of getting around this, but we since we already installed imagemagick to do some fiddling with the wallpapers, we can use it's built in screenshot tool `import`.
Import will save to a file, but we can also pipe its output to xclip if you want to just paste the screenshot into Slack or messages for web or something.


```bash
import -window root "$HOME/Pictures/screens/$(date '+%Y-%m-%d-%H:%M:%S').png"
```

Tragically, this will not work in XML. This is because the command is loaded as a string into OpenBox's manager system, then is executed as a string. For any command which does not rely on expansion, this is fine, but we want our command to change based on the output of `date`. Luckily, there is a workaround, we can instead write this command as a string and pass it to sh or bash. 
The full XML for the screenshots looks like this:

```xml
<keybind key="Print">
  <action name="Execute">
    <command>sh -c '''import -window root "/home/coen/Pictures/screens/$(date '+%Y-%m-%d-%H:%M:%S').png"'''</command>
  </action>
</keybind>
<keybind key="S-Print">
  <action name="Execute">
    <command>sh -c '''import "/home/coen/Pictures/screens/$(date '+%Y-%m-%d-%H:%M:%S').png"'''</command>
  </action>
</keybind>
<keybind key="C-S-Print">
  <action name="Execute">
    <command>sh -c '''import png:- | xclip -selection clipboard -t image/png'''</command>
  </action>
</keybind>
<keybind key="C-Print">
  <action name="Execute">
    <command>sh -c '''import -window root png:- | xclip -selection clipboard -t image/png'''</command>
  </action>
</keybind>
```

I've bound alternate behavior to Shift-Print, Control-Print, and Shift-Control-Print such that the "Shift" stands for "Selection", where `import` will pause the X-Server and allow us to select a region of the screen, and the "Control" stands for "Clipboard", where the output will go straight into the clipboard. This will be easy to remember because they share a first letter.

### Media Keys

Many modern computer keyboards include special keys or chords that, on windows, trigger behavior in a music player.
In windows there's a fancy program that selects the most recently focused window that supports media key input and then sends input to that. For now, we'll just hardcode that the media keys always go to `mpd`, we may want to write a script later that either sends it there or `mpv` with priority to `mpv`. We'll have volume controls pipe directly to ALSA, which is the standard audio library for linux. If you haven't yet installed it, you'll need `alsa-utils` for this.

```xml
<keybind key="XF86AudioPlay">
  <action name="Execute">
    <command>mpc toggle</command>
  </action>
</keybind>
<keybind key="XF86AudioNext">
  <action name="Execute">
    <command>mpc next</command>
  </action>
</keybind>
<keybind key="XF86AudioPrev">
  <action name="Execute">
    <command>mpc prev</command>
  </action>
</keybind>
<keybind key="XF86AudioStop">
  <action name="Execute">
    <command>mpc stop</command>
  </action>
</keybind>

<keybind key="XF86AudioRaiseVolume">
  <action name="Execute">
    <command>amixer set Master 5%+</command>
  </action>
</keybind>
<keybind key="XF86AudioLowerVolume">
  <action name="Execute">
    <command>amixer set Master 5%-</command>
  </action>
</keybind>
<keybind key="XF86AudioLowerVolume">
  <action name="Execute">
    <command>amixer set Master 5%-</command>
  </action>
</keybind>
<keybind key="XF86AudioMute">
  <action name="Execute">
    <command>amixer set Master toggle</command>
  </action>
</keybind>
```

You can feel free to change this as you see fit. `amixer` is the command that controls the audio drivers, so we get some simple media and volume controls out of this.
_XF86AudioWhatever_ is the standard code that X11 gets from keyboards. If you're on a laptop, your media keys might send a custom code. You can check this by installing `xev-xorg`, and running `xev` in a terminal. This will print out all key presses to the terminal, and you can see what the name of your media key is. Here is a sample output from pressing the Play/Pause button on my keyboard.

```shell
$ xev
KeyRelease event, serial 48, synthetic NO, window 0x600001,
    root 0x1e1, subw 0x0, time 5057632, (2716,-464), root:(2717,793),
    state 0x0, keycode 172 (keysym 0x1008ff14, XF86AudioPlay), same_screen YES,
    XLookupString gives 0 bytes: 
    XFilterEvent returns: False
```

The nice thing about live terminal programs like this is that you can use standard UNIX utilities to automatically filter out the stuff you don't need. This huge block of text is kinda hard for humans to easily parse, and if you roll your mouse over the window, you'll start getting events like crazy. You can pass this to the built-in REGEX utility `grep` to just pick out the word right before it tells you the keyname, then you'll just get that line of output.

```shell
$ xev | grep "keysym"
state 0x0, keycode 172 (keysym 0x1008ff14, XF86AudioPlay), same_screen YES,
```

### OpenBox Quirks

In order to commit changes to the OpenBox configs, we have to run `openbox --reconfigure`. There's a menu option though that triggers this action. By default it's under "System", so you just need to right click on the desktop and select it.

There's a little quirk of OpenBox which is that if you mess up the `rc.xml` file, then the menu won't load properly, and therefore you won't be able to easily trigger a reconfigure. We can fix that by mapping the Reconfigure action to Win-F11.

```xml
<keybind key="W-F11">
  <action name="Reconfigure"/>
</keybind>
```

Another quirk is that it uses a sort-of older method for moving windows around by default. Alt-Click and drag, and Alt-Right-Click and drag are used to move and resize windows respectively, so this will override any Alt-Click that your other apps use(Perhaps an IDE, since it is now standard for Alt-Click to be used to spawn another cursor).
We can look in the `<mouse>` section for these bindings and change all the `A-` to `W-`, which is a little more common these days. We can still use Windows style movement and resizing, where you click and drag on the top bar or the corner decorations, but this is another option (and my preferred method).

### Window Management

There are a couple features I'd really like to have. Coming from a tiling window manager, it would be nice to have at least windows style tiling. It doesn't need to be mouse controllable like windows (this is where you drag the window to the side or corner, and the window automatically resizes to fill). We also don't need it to go as far as even a simple tiler like i3, since otherwise what's the point of using openbox. Something as simple as making keybindings for it would be nice.

Treating a section of the keyboard as a 3x3 grid, we can use OpenBox actions to snap the focused window to a corner or edge of the screen. We'll use the "Super" key as the chord for it.

<img class='dm-safe-img' src='/media/rice/tiling_keys.png'>
<figcaption>In the diagram I'm using ⌘ to represent the "Super" key. On most computers it's marked with the windows logo but I couldn't make that look good in a diagram. In OpenBox it's a "W".</figcaption>

This leaves ⌘-S unassigned, or we can use it as a hotkey for "Maximize". I prefer ⌘-F as that (Super "Fullscreen") as that command though, so I'll probably keep it unassigned. Now for the implementation.

OpenBox has an action called ["MoveResizeTo"](http://openbox.org/wiki/Help:Actions#MoveResizeTo) that we can use.
First we can try it with the "Q" position.

```xml
  <keybind key="W-Q">
    <action name="MoveResizeTo">
      <x>+-0</x>
      <y>+-0</y>
      <monitor>current</monitor>
      <width>1/2</width>
      <height>1/2</height>
    </action>
  </keybind>
```

![Before](/media/rice/beforewq.png "Before")
![After](/media/rice/afterwq.png "After")

Yay it works! After implementing the rest of them we will have a good space-filling trick for our windows.

![Hiccup](/media/rice/hiccup.png "Hmm")

Dang it looks like this method doesn't work quite right for Super+W. Let's check the code.

```xml
  <keybind key="W-W">
    <action name="MoveResizeTo">
      <x>center</x>
      <y>+-0</y>
      <monitor>current</monitor>
      <width>1</width>
      <height>1/2</height>
    </action>
  </keybind>
```

From the OpenBox documentation, we see that the width/height box allows either pixels, percents, or fractions. Here's the problem, if I want to fill the space with a fraction, I'd use `1`, but it interprets this as 1 pixel wide. So you have to use percents here. There's another hiccup, by default, Super+D is the hotkey to hide/show all windows, so we'll have to change that to Ctrl+Super+D or Super+H or something.

And our final product (with terminals as test windows) looks like:

![Final Psuedo Tiling](/media/rice/psuedotile.png)

Looks pretty ugly now that we can't see the wallpaper anymore, but we can play with that later, perhaps by adding simple gaps between the windows, or maybe even implementing a third party tiler.

Since I have two monitors, we'll also need a system for moving things between monitors. I'll use "Super+Shift+M" for now, but it may be worth looking into using the openbox action "If" to find a way to make a double-tap in the appropriate direction go to the other monitor.

### Compositing

I mentioned compositors earlier, but now it's time to actually choose one. It doesn't show up well in screenshots, but when under load, windows will leave a trail if you move them around with your mouse. In addition we're going to want some lovely effects. I'm most familiar with `picom`, so we'll start with the experimental branch of that.

```bash
yay -S picom-git
```

We'll quickly implement my old configuration as a starting point, but here are the cliff's notes:
  - No drop shadows
  - No automatic transparency, let it be handled by the app.
  - Blur on transparent windows, `dual_kawase` kernel.
  - GLX backend
  - Higher than default fade speed. I had mine set to 0.1, note that this number means proportion per frame.
  - Vsync on.

And run with:
```bash
picom --experimental-backends
```

![Dual Kawase!? I didn't even know she was single!](/media/rice/picom1.png)

That's not such a bad place to start, and we can fiddle with the kitty settings later. Here's the problem, picom is not particularly buttery on our setup. It's really about poor integration with the NVIDIA drivers, but since I need to be able to use CUDA, nouveau is not an option. Let's see if we can't butter it up a little bit.

```bash
sudo pacman -S nvidia-settings
sudo nvidia-settings
```

Let's try forcing the composition pipeline on NVIDIA's end. It's hidden in the advanced display configuration.

![Nvidia settings whatever](/media/rice/nvidia.png "You'd be surprised how much weird stuff can be fixed in here.")

We'll need to check the box for both screens, then save it to the XOrg Config (this is why it needs sudo).
The results are not perfect, but they are MUCH better. Instead of before where the compositor is consistently bad, we now have one that's occasionally perfect and mostly passable. For lower framerate displays (like less than 100Hz), you'll never notice.

### OB Conf

Now we need to make a theme for openbox, this will affect our window decorations and our menu. Since we've already decided on a cold, dark palette, this shouldn't be too bad. What we'll need to consider are things like gradients, contrasts, weights, and other window effects.

Natura is the most modern of the built-in themes, so we'll use that as a starting point.

```bash
mkdir .themes
cp /usr/share/themes/Natura ~/.themes/SoyBison -r
```

I'm going to upload our wallpaper to Adobe Color to get a starting point.

<center>

|Code|Color|
|----|-----|
|#011826|<div style="color:#011826">&#9632;</div>|
|#013440|<div style="color:#013440">&#9632;</div>|
|#266573|<div style="color:#266573">&#9632;</div>|
|#8FBABF|<div style="color:#8FBABF">&#9632;</div>|
|#DCF0F2|<div style="color:#DCF0F2">&#9632;</div>|

</center>

Not so bad.

I'm going to add a window rule that makes all windows undecorated (no title or bottom handle) by default.

```xml
  <application name="*">
    <decor>no</decor>
  </application>
```

Since we've got most of our hotkeys worked out, we don't really need upper-right hand controls. We lose some usability, but it'll be fine.
We'll also drop the window borders for now.

I rebooted around this time, and found that there was an issue with picom on restart. Let's take a look at it.

### Picom Redux

So, the xrender backend fails on a cold boot for some reason, I don't really want to go into why, let's just figure out a workaround. Dual_Kawase as a blur method is generally pretty efficient, but as we saw earlier, there's still some issues, it for some reason slows down randomly on this computer. Lets try out a gaussian instead.

```python
# ~/.config/picom/picom.conf
blur-method = "gaussian"
blur-deviation = 4
blur-size=10
```

Here's a screenshot of `kitty` superimposed over some text from the web.

![blur test](/media/rice/blur_test.png)

[^1]: As a side-note, go play _Hacknet_, it has a wonderful story and great hacker-simulator-y puzzle gameplay.
[^2]: True Linux Patriots will get mad at me for this, but the NVIDIA graphics card with proprietary drivers is non-negotiable because I am a deep learning researcher and I need to be able to run CUDA. This may magically change in the future if PyTorch figures out a way to support Nouveau, but for now, Nvidia is fine, and as Linux usage rises, I suspect the proprietary drivers will become more accepted, and our composition pipelines will get neater.
[^3]: As a side note, that audio spectrum in the center bottom is from a package called `cava`, available on the AUR.
