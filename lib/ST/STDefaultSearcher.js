STSearcher.subClass('STDefaultSearcher', {
    
    initWithCallback: function(callback)
    {
        this.init();
        this.callback = callback;
    },
    
    search: function(term)
    {
        this.setResults(ST.A(
            this.callback(term)
        ));
    },
    
end
:0});