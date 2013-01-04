Find It For Me
===============

A Google Places API application that makes it easy to find places of interest in the City of Philadelphia.

Overview
========

The Google Places API is a powerful resource to build location based apps, and to provide rich information on the places of interest in a city. Developers can pair this powerful resource with the data that Philadelphia has made available through the [OpenDataPhilly.org](OpenDataPhilly.org) data portal and build an app that can change the face of a community.

Find It For Me is designed to work with older feature phones (SMS interface) and newer smart phones (map interface). It uses both the Google Places API and open data from the City of Philadelphia.

This app is built with:
=======================

[Node.js](http://nodejs.org/), specifically the following modules are used:

* [node-twilio](https://github.com/sjwalter/node-twilio) - A Twilio helper library for node.
* [geonode](https://github.com/feliperazeek/geonode) - A very basic, but simple, geocode library, currently using Google Geocode API (v3)
* [google-places](https://github.com/jpowers/node-google-places) - A Google Places lib for node.js.
