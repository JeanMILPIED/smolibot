# utils/energy_tracker.py
import psutil
import time

def measure_energy_cost(func, *args, **kwargs):
    process = psutil.Process()
    cpu_start = process.cpu_times()
    mem_start = process.memory_info().rss
    time_start = time.time()

    result = func(*args, **kwargs)

    time_end = time.time()
    cpu_end = process.cpu_times()
    mem_end = process.memory_info().rss

    cpu_time_used = (cpu_end.user - cpu_start.user) + (cpu_end.system - cpu_start.system)
    duration = time_end - time_start
    memory_used = (mem_end - mem_start) / (1024 * 1024)  # in MB

    # Assume average CPU power draw (approx.) in watts
    estimated_power_watts = 15  # Adjust based on your hardware
    energy_wh = (estimated_power_watts * duration) / 3600

    return result, {
        "cpu_time": cpu_time_used,
        "duration": duration,
        "energy_wh": energy_wh,
        "memory_diff_mb": memory_used
    }
