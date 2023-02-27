{
    function scaleFocus() {
        $(".focus").each(function(index) {
            const t = this.getBoundingClientRect().top;
            const b = this.getBoundingClientRect().bottom;
            const h = this.getBoundingClientRect().height;
            const vh = window.innerHeight;
            const y = Math.max(Math.min((h/2 + t)/vh, 1), 0)
            const scale = 1.05 - (Math.abs(y - 0.5) / (10));

            $(this).css("transform", "scale(" + scale.toString() + ")");
        })
    }
    document.body.onscroll = scaleFocus
}
