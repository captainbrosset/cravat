# cravat

*Stylish HTML5 photo booth for your website!*

Cravat is a small javascript utility that creates a photo booth in your web page and let's your users create pictures/avatars.

Cravat relies on the latest sexiest HTML5 APIs, so you'll need the latest browsers to run it (namely *video*, *canvas* and *getUserMedia*).

## Using cravat

Take a look at the example html file. Including cravat in a site is as simple as including 1 js and 1 css file and then doing something like:

```
var cravat = new Cravat({
  width: 300,
  height: 300,
  root: myDiv
});
```

## javascript API

Cravat exposes a very simple API:
* cravat.snap() to take a shot
* cravat.setTransform(transform) to switch to a different transform
* cravat.setFilter(filter) to switch to a different filter
* cravat.setOverlay(overlay) to apply a different overlay

## Customizing the way cravat looks

### Styling

2 CSS files are provided, the bare cravat.css which let's you style everything yourself, and the cravat-default.css which provides some basic stylings.

Just take a look at the (very simple) HTML produced by cravat to see how you can style it yourself to your needs.

### Strings

You can change strings used by cravat in its UI by overriding entries in `Cravat.i18n`

### Filters, transformers, overlays

The best part about cravat is its filters and transformers an overlays, however there aren't that many for now, so one way to customize cravat to your needs is to add more.

## Contributing

Use Github to fork and clone cravat locally.

How to build cravat
* sudo npm install -g packman
* packman