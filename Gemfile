source "https://rubygems.org"

gem "jekyll", "~> 4.3"
gem "github-pages", group: :jekyll_plugins
gem "jekyll-remote-theme"

group :test do
  gem "html-proofer", "~> 5.0"
end

# Windows and JRuby does not include zoneinfo files
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]
