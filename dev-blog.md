# Dev Blog

## 1-14-2020

#### Overview

First day of the project. Setup the repo, got a basic README together, and created a bare-bones homepage along with completed signup/login pages.

#### Design

I'm terrible with design, but it is something I am interested in learning in the future. For now, I'm modeling my signup/login pages on [TickTick.com's](https://ticktick.com/) signup/login page. The homepage is super basic, as I don't have anything in mind design-wise. I will need to look at some other site homepages to get inspiration.

#### Breaking up CSS/JS

Since I am only planning on having 3 main sections to the app, I decided to have unique CSS/JS for each section. So, the homepage has it's own CSS/JS, the login/signup pages share CSS/JS, and the main app page will have it's own. This may not be the best way to do things, but for now it seems to be an efficient way to break up the logic between the sections.

#### Using a subset of Font Awesome

I'm using Font Awesome icons for the site, but I don't want to load all of the Font Awesome resources just to use a few icons. I dug through the source, and it was pretty simple to pull only the CSS declarations I needed into a file `subset.css`. I'm probably overthinking things here, but it just makes me feel better to only send bytes across the wire that I'm using to render the page, not an entire framework for 3 icons.

#### CSS Layout

I haven't really studied CSS layout enough, but I'm trying to use some modern tools like Flexbox in this project. I'm lining up elements in the form using pixels and my eye, which is probably not great. If this were a responsive project, I would need to put in more work to figure out how to get everything to line up correctly across screen sizes.

#### Neat CSS discoveries

I'm already finding some cool CSS functionality that I wasn't aware of before starting this app. The `@import` rule is nice for concatenating CSS files. I'm using it to throw the `subset.css` stylesheet, which has the Font Awesome CSS that I'm using, into the `login_signup-styles.css`. I'm also using CSS custom variables to put a name to related styles. 