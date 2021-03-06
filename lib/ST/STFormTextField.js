STFormField.subClass('STFormTextField', {
    init: function()
    {
        this._super();
        
        this.autoTrim = true;
        this.minLength = null;
        this.maxLength = null;
        this.value = '';
    },
    
    autoTrim:  ST.$property,
    minLength: ST.$property,
    maxLength: ST.$property,
    
    setValue: function(value)
    {
        this._super(value);
        if (this.loaded) {
            this.inputTag.val(value);
        }
    },
    
    render: function(element)
    {
        this._super(element);
        this.inputTag = ST.inputTag();
        if (this.value != null) {
            this.inputTag
                .val(this.value)
                .addClass('text')
                .keypress(this.methodFn('inputChanged'))
                .change(this.methodFn('inputChanged'));
        }
        
        element.append(this.inputTag);
    },
    
    inputChanged: function(e)
    {
        if (e && e.which && e.which == 13) {
            this.trigger('submit');
        } else {
            this.value = this.inputTag.val();
            if (this.autoTrim) {
                this.value = $.trim(this.value);
            }
            this.trigger('valueChanged', this.value);
        }
    },
    
    isValid: function()
    {
        var l = this.value && this.value.length;
        if (this.minLength != null && l < this.minLength) return false;
        if (this.maxLength != null && l > this.maxLength) return false;
        return true;
    },
end
:0});