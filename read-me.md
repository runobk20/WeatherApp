### Weather App

The design was made in Figma and implemented with Bootstrap, editing somo of it's variables with SASS, and adding some own CSS code.

The script of this page works around a class which connect to [Visualcrossing Weather API](https://www.visualcrossing.com).

This class have a method to connect to the API and some methods to get the data with different inputs given by the user.
A method that renders that data from the API to the DOM in a Weather card.
And a method that create the element with the forecast for the next 5 days, that is used in class.render() to append it to the weather card.

If the temperature ir above 24ºC the card will be orange, and if less, the card will be blue!
