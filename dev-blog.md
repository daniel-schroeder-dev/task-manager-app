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

## 1-16-2020

#### Sessions

I'm going to be using sessions in this app to keep track of the User's login status. I haven't used them in Node before (only PHP a few years ago), but it seems straighforward enough to implement with the `express-session` npm module. Redis seems to be a good option for session storage, I will research adding that to the project soon.

#### SPA

The main `dashboard.ejs` file will serve as the heart of the app, and will be a single page application. I've never made one of these before, but I think I understand the basic concepts enough to get one going in this case.

#### Environment Variables

I'm using `dotenv` in this project as opposed to `env-vars` which was used in the Node course I took. `dotenv` was very easy to understand and setup. I still need to setup the heroku environment variables though.

## 1-17-2020

#### Sessions Out, JWT In

After reading up on sessions for awhile, I decided to fall back to using JWT authentication for this app, at least for now. The main point of building this app is to practice concepts I've already learned, not to add more complexity, and setting up Redis and express-session would involve learning a slightly new way of authentication, so I'm going to stick with what I know for now but may drop in another strategy in the future.
