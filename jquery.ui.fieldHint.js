/*
 fieldHint Plugin for jQuery UI is copyright (c) 2012 Eddy Luten.

 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
(function($) {
  $.widget('el.fieldHint', {
    options: {
      hint: null,
      hintClass: null,
      removeTitle: false,
      clearOnSubmit: true
    },

    _create: function() {
      var data = { ref: this };

      if (!!this.options.removeTitle)
        this._removeTitle();

      // Add a submit handler to make sure that the hint is not submitted:
      this.closestForm = this.element.closest('form');

      if (!!!this.options.clearOnSubmit)
        this._setSubmitHandler();

      this.element.bind('focus', data, this._elementFocus);
      this.element.bind('blur', data, this._elementBlur);

      // Check if the browser supports document.activeElement, if so, make sure
      // that this element does not have focus. Otherwise, apply the hint.
      if (typeof(document.activeElement) == 'undefined' || document.activeElement != this.element[0])
        this._elementBlur({ data: data });
    },

    // Gets the normalized value of the field
    getValue: function() {
      return this.element.val() == this.getHint() ? '' : this.element.val();
    },

    // Gets the hint displayed
    getHint: function() {
      return this.options.hint || this.element.attr('title');
    },

    // Visibly removes the hint from the field (CSS class + value)
    removeHint: function() {
      if (this.options.hintClass && this.element.hasClass(this.options.hintClass))
        this.element.removeClass(this.options.hintClass);

      if (this.element.val() == this.getHint())
        this.element.val('');
    },

    // Sets the submit handler that clears out hint values on submit
    _setSubmitHandler: function() {
      if (!this.submitHandlerSet) {
        this.closestForm.bind('submit', { ref: this }, this._formSubmit);
        this.submitHandlerSet = true;
      }
    },

    // Removes the submit handler
    _removeSubmitHandler: function() {
      if (this.submitHandlerSet)
        this.closestForm.unbind('submit', this._formSubmit);
    },

    // Removes the title attribute from the field
    _removeTitle: function() {
      this.originalTitle = this.element.attr('title');
      this.element.removeAttr('title');
    },

    // Restores the field's title attribure
    _restoreTitle: function() {
      if (this.originalTitle)
        this.element.attr('title', this.originalTitle);
    },

    // Makes sure that hints are not submitted
    _formSubmit: function(e) {
      var $elem = e.data.ref.element;
      if ($elem.val() == e.data.ref.getHint())
        $elem.val('');
    },

    // Hides the hint (onfocus)
    _elementFocus: function(e) {
      var $elem = e.data.ref.element;
      if ($elem.val() == e.data.ref.getHint()) {
        $elem.val('');

        if (e.data.ref.options.hintClass)
          e.data.ref.element.removeClass(e.data.ref.options.hintClass);
      }
    },

    // Shows the hint (onblur)
    _elementBlur: function(e) {
      var $elem = e.data.ref.element;
      if (!$elem.val()) {
        $elem.val(e.data.ref.getHint());

        if (e.data.ref.options.hintClass)
          e.data.ref.element.addClass(e.data.ref.options.hintClass);
      }
    },

    _setOption: function(key, value) {
      var isSet = false;

      switch(key) {
        case 'hint':
        {
          if (this.element.val() == this.getHint()) {
            this.element.val('');
            isSet = true;
          }

          this.options.hint = value;

          if (isSet)
            this.element.val(this.getHint());
          break;
        }

        case 'hintClass':
        {
          if (this.options.hintClass && this.element.hasClass(this.options.hintClass)) {
            this.element.removeClass(this.options.hintClass);
            isSet = true;
          }

          this.options.hintClass = value;

          if (isSet)
            this.element.addClass(this.options.hintClass);
          break;
        }

        case 'removeTitle':
          // if the new value is true, simply remove the title
          if (!!value && this.element.attr('title'))
            this._removeTitle();
          else
          // if the new value is false, restore the original title if it was
          // previously removed:
            this._restoreTitle();
          break;

        case 'clearOnSubmit':
          if (!!value)
           this._setSubmitHandler();
          else
            this._removeSubmitHandler();
          break;
      }

      $.Widget.prototype._setOption.call(this, key, value);
    },

    destroy: function() {
      // Restore the field's original values
      this._restoreTitle();
      this.removeHint();

      // Remove the event bindings
      this.element.unbind('focus', this._elementFocus);
      this.element.unbind('blur', this._elementBlur);
      this._removeSubmitHandler();

      $.Widget.prototype.destroy.call(this);
    }
  });
})(jQuery);
