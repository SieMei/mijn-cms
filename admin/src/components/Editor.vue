<template>
  <div>
    <div class="toolbar">
      <button @click="toggleBold">B</button>
      <button @click="toggleItalic">I</button>
      <button @click="addImage">Img</button>
      <button @click="htmlMode = !htmlMode">HTML</button>
    </div>

    <div v-if="!htmlMode">
      <editor-content :editor="editor" />
    </div>

    <textarea v-else v-model="model" style="width:100%;height:300px"></textarea>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'

export default {
  components: { EditorContent },

  props: {
    modelValue: String
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const htmlMode = ref(false)
    const model = ref(props.modelValue)

    const editor = new Editor({
      extensions: [StarterKit, Image],
      content: props.modelValue,
      onUpdate: ({ editor }) => {
        emit('update:modelValue', editor.getHTML())
      }
    })

    watch(() => props.modelValue, v => {
      if (v !== editor.getHTML()) editor.commands.setContent(v)
    })

    function toggleBold() { editor.chain().focus().toggleBold().run() }
    function toggleItalic() { editor.chain().focus().toggleItalic().run() }

    async function addImage() {
      const file = await selectFile()
      if (!file) return

      const form = new FormData()
      form.append('file', file)

      const res = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: form
      })

      const json = await res.json()

      editor.chain().focus().setImage({ src: json.url }).run()
    }

    function selectFile() {
      return new Promise(resolve => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.onchange = () => resolve(input.files[0])
        input.click()
      })
    }

    return { editor, htmlMode, model, toggleBold, toggleItalic, addImage }
  }
}
</script>

<style>
.toolbar button {
  margin-right: .5rem;
}
</style>