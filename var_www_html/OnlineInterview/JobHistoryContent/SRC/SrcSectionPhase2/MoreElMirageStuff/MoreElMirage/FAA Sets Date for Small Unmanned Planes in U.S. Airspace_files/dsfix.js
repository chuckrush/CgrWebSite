var win_resize_counter = 0;
var obj_resize_counter = 0;

function GCWindowResize(GCObject)
{
    win_resize_counter++;
    if(win_resize_counter<3)
    {
        if (TestGCObject(GCObject))
        {
            glGCResizeCounter=0;
            GCResizeGridControl(GCObject);
        }
    }
    else
        win_resize_counter=0;
}

function GCOnResizeGridControl(GCObject)
{
    obj_resize_counter++;
    if(obj_resize_counter<2)
    {
        if (TestGCObject(GCObject))
        {
            if (glGCResizeCounter < cGCMaxGCResizeCount)
            {
                glGCResizeCounter++;
                GCResizeGridControl(GCObject);
            }
        }
    }
    else
        obj_resize_counter = 0;
}