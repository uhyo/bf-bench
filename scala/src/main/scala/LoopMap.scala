import scala.collection.mutable.{HashMap, Stack}

class LoopMap(_code: Array[Byte]) {
  private[this] val code = _code
  private[this] val cache: HashMap[Int, Int] = new HashMap()

  def findEnd(pc: Int): Int = {
    val codeLength = code.length

    if (code(pc) != 0x5b) {
      throw new RuntimeException("Invalid Instruction")
    }

    // If it is already in the cache, return that value.
    cache.get(pc) match {
      case Some(res) => return res
      case None => ()
    }

    // otherwise search the source code.
    var stack = List[Int]()

    var current_pc = pc + 1
    while (current_pc < codeLength) {
      code(current_pc) match {
        case 0x5b => {
          // '['
          stack = current_pc :: stack
        }
        case 0x5d => {
          // ']'
          stack.headOption match {
            case None => {
              cache(current_pc) = pc
              cache(pc) = current_pc
              return current_pc
            }
            case Some(start) => {
              cache(start) = current_pc
              cache(current_pc) = start
              stack = stack.tail
            }
          }
        }
        case _ => ()
      }
      current_pc += 1
    }
    throw new RuntimeException("Could not find corresponding ']'")
  }
  def findStart(pc: Int): Int = {
    if (code(pc) != 0x5d) {
      throw new RuntimeException("Invalid Instruction")
    }
    cache.get(pc).get
  }
}
