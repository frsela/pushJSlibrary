NOTES:
======

1.  The 'custom' reporter for Jasmine test output won't work while we're using "file:///" to run the tests 
    (it needs http protocol so it has permission to write a file on the server).
    It may also need Apache server or similar, because it needs to run a tiny 'php' file.
    *Possibly* I can do this with node.js directly, so hold that thought ...

2.  Put the latest 'jasmine' into the 'jasmine' folder with no sub-folders, so this folder should contain
    jasmine.js, jasmine-html.js etc... (you can ignore the 'spec' and 'src' directories that come with jasmine).
    
