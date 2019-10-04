# Chadev.com

The future home of chadev.com. Woot!
We'll be designing and developing this publicly, so expect to see lots of changes and few bugs ;)

## Adding yourself to the developers list

We invite anyone who identifies as a developer or is interested in becoming a developer in Chattanooga to join our community.

For directions on how to add yourself see [the Wiki page](https://github.com/chadev/chadev.github.io/wiki/Adding-yourself-to-the-Devs-list)

Feel free to contact us via the [Chadev Slack](https://chadev.typeform.com/to/nCm0Ap), or email chadevhelp@gmail.com if you have trouble.

## Instructions for Local Development

To replicate our development environment a number of open source tools are required, specifically:

* [Ruby](https://www.ruby-lang.org/) version 2.3.x+
* [RubyGems](https://rubygems.org/pages/download) If not packaged with Ruby
* [Jekyll](http://jekyllrb.com)

## Getting Started

### Install bundler

~~~ sh
$ gem install bundler
~~~

### Have bundler resolve your dependencies

~~~ sh
$ bundle install
~~~

### Run Jekyll Server

~~~ sh
$ jekyll serve
~~~

If that fails with an error about missing dependencies, you may need to run the Jekyll server with `bundle exec`.

~~~ sh
$ bundle exec jekyll serve
~~~

### Open Browser

Navigate to http://localhost:4000/

For more information about options for the Jekyll server, such as binding to a
specific address or port, see `jekyll --help`.

## Acquiring an API key for the events page

1. Go to the [Google Developers Console](https://console.developers.google.com).
2. Create a new project.
3. In the sidebar on the left, expand APIs & auth. Next, click APIs. In the list of APIs, make sure the calendar API is turned on.
4. In the sidebar on the left, select Credentials.
5. Click Create new Key and select Browser Key.
6. Enter `*localhost:4000/*` in the *"Accepts Requests From"* text box and click create.
7. Copy the new API key and replace the one located in the [event.js file](assets/js/events.js).
8. It should look something like `gapi.client.setApiKey('YOUR API KEY);`.
9. Wait a few moments, then navigate to [http://localhost:4000/events/](http://localhost:4000/events/) to make sure it worked.

## Contributing :book:

Interested in contributing to this project? Check out our [contributing information](CONTRIBUTING.md)

## Contributers

If you've contributed to this project please add yourself to our [CONTRIBUTORS.md](CONTRIBUTORS.md) file.

## License

This work is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/).
