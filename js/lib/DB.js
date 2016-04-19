/**
 * # USAGE
 *
 * // establish a connection
 * var conn = new DB.Conn(
 *    "https://my.api.baseurl.com",
 *    "APIKEY"
 * );
 *
 * // run a GET request
 * conn.get("CollectionName").then(function(d) {
 *    alert(d);
 * });
 *
 * // run a POST request
 * conn.post("CollectionName", {"_id": "01", "name": "My Test"}).then(function(d) {
 *    alert("Success!");
 * });
 */

var DB = (function() {
   var self = this;

   self.strBaseURL = "";
   self.strAPIKey  = "";

   function DB(strBaseURL, strAPIKey) {
      self.strBaseURL = strBaseURL;
      self.strAPIKey  = strAPIKey;
   }

   DB.prototype.get = function(strURI, params) {
      params  = (!params) ? "" : params;
      var fullurl = self.strBaseURL + strURI + "?apiKey=" + self.strAPIKey + params;
      return $.ajax({
         url: fullurl,
         type: "GET",
         contentType: "application/json"
      });
   }

   DB.prototype.post = function(strURI, data) {
      var fullurl = self.strBaseURL + strURI + "?apiKey=" + self.strAPIKey;
      return $.ajax({
         url: fullurl,
         data: JSON.stringify(data),
         type: "POST",
         contentType: "application/json"
      });
   }

   DB.prototype.removeItem = function(strURI, query) {
      var fullurl = self.strBaseURL + strURI + "?apiKey=" + self.strAPIKey + "&q=" + query;
      return $.ajax({
         url: fullurl,
         data: JSON.stringify([]),
         type: "PUT",
         contentType: "application/json"
      })
   }

   return DB;
})();