<!-- - spinner / loading indicator -->
<!-- transparent image as placeholder instead -->
<!-- - drop target indication -->
 <!-- - instead of child element use class and ::before -->
 <!-- - with pos:abs we might not need special event handling for dragleave -->
 <!-- - problem: dataTransfer.types is an Array on webkit but DOMStringList on FF -->
<!--  do nothing if not dropped from outside  -->
<!-- - fix problem with empty document -->
<!-- - handling of files other than images -->
   <!-- (postponed - backend doesn't support this) -->
<!-- - progress meter if possible -->
<!-- not really necessary since we shouldn't upload large individual files; with many files progress is visible for each -->
- bug: if the same file dropped twice, one remains a ghost