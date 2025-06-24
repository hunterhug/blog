FROM jekyll/jekyll:3.8.6
MAINTAINER hunterhug <gdccmcm14@live.com>


COPY . /srv/jekyll/

CMD ["jekyll", "--help"]
ENTRYPOINT ["/usr/jekyll/bin/entrypoint"]