# Cloud-Developer-Dashboard
All developer information directly on the dashboard

This is a simple project that lets you see all important Umbraco Cloud project information on the dashboard.
This is build without support of HQ so if they change anything that my code uses this will probably create a mess.
It relies on the fact that the favorite star in a project contains the project ID. If that’s gone for some reason than this project will become useless since there is no other reference to project id’s.If that happens disable this and let me know and I'll see if it's possible to fix it.

For now it show:
- Baseline name
- Environments
- Environment versions
- Usage statistics

![Screenshot](/screenshot.png?raw=true "Screenshot")

Requirements:
- Google Chrome
- [User javascript and css extension](https://chrome.google.com/webstore/detail/user-javascript-and-css/nbhcbdghjpllgmfilhnhkllmkecfmpld)

Setup:
- Open the extension
- Add https://www.s1.umbraco.io/projects as Url to prevent messing up other pages
- Copy js to the js pane
- Copy css to the css pane
- Save and enjoy

Todo:
- ~~Add alert panel above the project list~~
- ~~Optimization (where possible).~~
- ~~Don't know yet...~~
- Wait for the official dashboard to be released ;-)
