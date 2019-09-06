var Layout = {
    $type:"table",
    style:"width:100%;height:100%;",
    $components: [
        {
            $type:"tr",
            $components: [
                {
                    $type:"td",
                    style:"height:1px;text-align:left;",
                    $components: [Header]
                }
            ]
        },
        {
            $type:"tr",
            $components: [
                {
                    $type:"td",
                    style:"vertical-align:top;text-align:left;",
                    $components: [Contents]
                }
            ]
        },
        {
            $type:"tr",
            $components: [
                {
                    $type:"td",
                    style:"height:1px;text-align:left;",
                    $components: [Footer]
                }
            ]
        }
    ]
};