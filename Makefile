.PHONY: all gh-pages

all: gh-pages

gh-pages:
	mkdir output
	cp -r library output
	cp -r test output
	git checkout gh-pages
	rm -rf push
	mv output push
	git add push
	git commit -m "Automatic documentation generation"
	git push origin gh-pages
	git checkout master
