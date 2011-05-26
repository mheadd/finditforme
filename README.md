Find It For Me
===============

An SMS application that finds service locations and places of interest in cities.

Overview
========

This application is an outgrowth of work done in cities across the country to convert geographic data to developer friendly formats.  This effort - pioneered in the [City of Portland](http://pdxapi.com/) - has been replicated in [other cities](http://phlapi.com/), making a wide variety of geographic data available to developers in easy to use formats.

The application works by letting users send a simple text message (from any SMS-enabled mobile phone) to find the closest location in their neighborhood for a specific type of service (e.g., libraries, schools, etc.)  This helps citizens become more connected to their communities by making it easy to find the things they need in their own communities.

Where is the closest library to where you live or work?  Where is the closest school, hospital, senior center, recreation center, public pool, polling place, or hospital?  This app answers these question by allowing people to send a simple text message like this:

	2400 Chestnut Street, Philadelphia, PA #libraries

Will it work in my city?
========================

This application is designed to work with instances of [CouchDB](http://couchdb.apache.org/) that support spatial queries.  A number of data repositories using this platform have been built for cities in different parts of the country.  If one does not yet exist in your city, [setting one up](http://maxogden.com/#/blog/diy-public-data-api) is easy.

In addition, in those cities where a data repository like this already exists, it is easy to add new data sets.  Building useful community apps that use these CouchDB-based data repositories provides an incentive to add to existing data sets, enhancing their value to the communities they are meant to serve.

This app is built with:
=======================

[Node.js](http://nodejs.org/), specifically the following modules are used:

* [SMSified-node](https://github.com/smsified/smsified-node) - A module for sending and receiving SMS messages (text messages) with the SMSified API.
* [cradle](https://github.com/cloudhead/cradle) - a high-level, caching, CouchDB client
* [geonode](https://github.com/feliperazeek/geonode) - A very basic, but simple, geocode library, currently using Google Geocode API (v3)

The application uses the [SMSified](http://smsified.com) platform to send and receive text messages.

It can be hosted on [Nodester](http://nodester.com/) (an open source Node.js hosting platform) and uses CouchDB for message delivery logging (cloud services like [IrisCouch](http://www.iriscouch.com/) are a good fit for this, but you can use any CouchDB instance that you like).