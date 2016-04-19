var BibleBooksView = (function() {
   var self = this;
   self.strContainer = "";

   function BibleBooksView(strContainer) {
      self.strContainer = strContainer;
      self.DB = new DB(
         "https://api.mlab.com/api/1/databases/lifegems/collections/",
         "CY73dQUZRrVfx3SWzj77PZ8QbCk-6ilZ"
      );
      displayAllBooks();

   }

   function saveChapters(aChapterIDs, blSave) {
      var qUser = "&q={'user':'" + VC.user + "'}";
      DB.get("ReadingProgress", qUser).then(function(data) {
         data = (data[0]) ? data : initUserData(VC.user);
         $.each(aChapterIDs, function(i, strChapterID) {
            var index = $.inArray(strChapterID, data[0].completed_chapters);
            if (blSave && index === -1) {
               console.log(data);
               data[0].completed_chapters.push(strChapterID);
            } else if (!blSave && index !== -1) {
               data[0].completed_chapters.splice(index, 1);
            }
         });
         DB.post("ReadingProgress", data[0]);
      });
   }

   function getChapterButton(strName, intChapterID) {
      var $chapter = $('<div></div>', {id: intChapterID, class: "chapters--item"});
      $chapter.text(strName);
      if (strName === "ALL") {
         $chapter.html("<i style='margin-top:10px' class='material-icons'>done_all</i>");
      }
      $chapter.click(function(e) {
         if ($(this).text() === "done_all") {
            console.log("");
         } else if ($(this).hasClass("chapters--complete") === true) {
            $(this).removeClass("chapters--complete");
            saveChapters([$(this).attr('id')], false);
         } else {
            $(this).addClass("chapters--complete");
            saveChapters([$(this).attr('id')], true);
         }
      });
      return $chapter;
   }

   function getBookName(strBookName) {
      var $title = $('<div>', {class: 'book--title'});
      $title.text(strBookName);
      return $title;
   }

   function listChapters(intCount, strCode) {
      var $chapters = $('<div>', {class: 'chapters'});
      for (var i = 1; i <= intCount; i++) {
         var $chapter = getChapterButton(i, strCode + i);
         $chapter.attr('data-group', strCode);
         $chapters.append($chapter);
      }
      var $finish = getChapterButton("ALL", strCode + "ALL");
      $finish.attr('data-group', strCode);
      $finish.attr('data-done', 'false');
      $finish.click(function(e) {
         var $chapters = $('[data-group='+strCode+']');
         var aChapters = [];
         if ($(this).attr('data-done') === 'true') {
            $(this).attr('data-done', 'false');
            $chapters.removeClass('chapters--complete');
            $.each($chapters, function(i, chap) {
               if ($chapters.length - 1 > i) {
                  aChapters.push($(chap).attr('id'));
               }
            });
            saveChapters(aChapters, false);
         } else {
            $(this).attr('data-done', 'true');
            $('[data-group='+strCode+']').addClass('chapters--complete');
            $.each($chapters, function(i, chap) {
               if ($chapters.length - 1 > i) {
                  aChapters.push($(chap).attr('id'));
               }
            });
            saveChapters(aChapters, true);
         }
      });
      $chapters.append($finish);
      return $chapters;
   }

   function getIconColor(intIndex) {
      var color = "blue";
      if ($.inArray(intIndex, [0,1,2,3,4,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,65]) !== -1) {
          color = "#3B3547";
      } else if ($.inArray(intIndex, [5,6,7,8,9,10,11,12,13,14,15,16,43]) !== -1) {
          color = "#746B84";
      } else if ($.inArray(intIndex, [17,18,19,20,21,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64]) !== -1) {
          color = "#544C63";
      }
      return color;
   }

   function initUserData(strUserName) {
      return [{
         "user": strUserName,
         "start_date": "20150610",
         "completed_chapters": []
      }];
   }

   function displayAllBooks() {
      self.DB.get("BibleBooks", "&s={_id:1}").then(function(data) {
         $.each(data, function(i, d) {
            var $BkIcon = $("<div></div>", {id: d.BookCode, class: "book--icon"});
            var strShortName = "<span class='book--icon--short'>" + d.BookCode + "</span>";
            var strLongName = "<span class='book--icon--long'>" + d.BookName + "</span>";
            $BkIcon.html(strShortName + strLongName);
            var color = getIconColor(i);
            $BkIcon.css('background-color', color);
            $BkIcon.click(function(e) {
               var id = '#' + $(this).attr('id') + '-s';
               if ($(id).hasClass('is-hidden')) {
                  $("[id$='-s']").addClass('is-hidden');
                  $(".book--icon").removeClass('selected');
                  $(this).addClass('selected');
                  $(id).removeClass('is-hidden');
               } else {
                  $(this).removeClass('selected');
                  $(id).addClass('is-hidden');
               }
            });

            var $ChapSection = $("<div></div>", {id: d.BookCode + "-s",class: "book--section is-hidden"});
            var $BookName = getBookName(d.BookName);
            var $Chapters = listChapters(d.Chapters, d.BookCode);
            $ChapSection.append($BookName);
            $ChapSection.append($Chapters);

            var $Book = $("<div></div>", {class:"book"});
            $Book.append($BkIcon);
            $Book.append($ChapSection);

            if (i === 0) {
               var $hebHeading = $("<h3>", {class:'book--heading'});
               $hebHeading.text("HEBREW SCRIPTURES");
               $(self.strContainer).append($hebHeading);
            }
            if (i === 39) {
               var $grkHeading = $("<h3>", {class:'book--heading'});
               $grkHeading.text("CHRISTIAN GREEK SCRIPTURES");
               $(self.strContainer).append($grkHeading);
            }
            $(self.strContainer).append($Book);
         });
         var qUser = "&q={'user':'" + VC.user + "'}";
         DB.get("ReadingProgress", qUser).then(function(data) {
            data = (data[0]) ? data : initUserData(VC.user);
            $.each(data[0].completed_chapters, function(_, strChapterID) {
               $('#' + strChapterID).addClass("chapters--complete");
            });
         });
      });
   }

   return BibleBooksView;
})();