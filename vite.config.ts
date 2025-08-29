import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { execSync } from 'child_process'

// Git 커밋 해시 가져오기
const getGitCommitHash = () => {
  try {
    return execSync('git rev-parse HEAD').toString().trim()
  } catch {
    return 'unknown'
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/jk-jh/',
  define: {
    __GIT_COMMIT_HASH__: JSON.stringify(getGitCommitHash())
  }
})
