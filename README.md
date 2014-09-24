#Chadev.com

The future home of chadev.com. Woot!  
We'll be designing and developing this publicly, so expect to see lots of changes and few bugs ;)

##Adding yourself to the developers list

* Fork the github repo
* Clone your fork to your favorite developer environment
* Use an existing [developer].md file as a basis for your own
* Replace all relevant info
* Replace the gravatar hash with the MD5 hash output by this command:
~~~ sh
    echo -n "your_gravatar_email" | md5sum
~~~
* Commit and push your changes to your fork
* Submit a pull request to the master branch of this repo

Feel free to contact us via the #chadev IRC channel on freenode, or email chadevhelp@gmail.com if you have trouble.

##Instructions for Local Development

To replicate our development environment a number of open source tools are required, specifically:

* [Node](http://nodejs.org)
* [Gulp](http://gulpjs.com)
* [Jekyll](http://jekyllrb.com)

##Getting Started

###Install Node
Simply visit [nodejs.org](http://nodejs.org) and click on the big green “Install” button.

###Install Gulp Globally

~~~ sh
$ npm install -g gulp
~~~

###Install Jekyll

~~~ sh
$ gem install jekyll
~~~


###Install Dependencies

Make sure you're in the root project folder.

~~~ sh
$ npm install
~~~

###Run Gulp

~~~ sh
$ gulp
~~~
