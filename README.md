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

* [SMSified-node](https://github.com/smsified/smsified-node) - A module for sending and receiving SMS messages (text messages) with the SMSified API.
* [cradle](https://github.com/cloudhead/cradle) - a high-level, caching, CouchDB client
* [geonode](https://github.com/feliperazeek/geonode) - A very basic, but simple, geocode library, currently using Google Geocode API (v3)

The application uses the [SMSified](http://smsified.com) platform to send and receive text messages.